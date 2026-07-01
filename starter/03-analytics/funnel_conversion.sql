-- funnel_conversion.sql
-- Modules 1.2 (SQL: joins -> funnels) and 1.6 (segmentation, BI)
--
-- Buyer lifecycle funnel for a B2B wholesale marketplace. Measures where
-- DEMAND FRICTION lives (issue-tree branch B1): registered -> activated ->
-- repeated -> retained. Step conversion = where you lose GMV you should capture.
--
-- Definitions of "activated" (first order) and "active" (recency) must match
-- 02-metrics-dictionary/metrics.yml. Dialect: ANSI-ish; adjust date fns.
-- TODO: replace object names with your real warehouse tables.

WITH buyers AS (
    -- The population entering the funnel: registered retailer accounts.
    SELECT
        b.buyer_id,
        DATE_TRUNC(b.registered_at, MONTH) AS reg_month,   -- TODO dialect
        b.region,
        b.acquisition_channel                              -- feeds 3.3 attribution
    FROM dim_buyer b
    WHERE b.is_test = FALSE
),

orders AS (
    -- Qualifying orders only (same filter as the metrics dictionary).
    SELECT
        o.buyer_id,
        o.order_id,
        o.order_date,
        ROW_NUMBER() OVER (PARTITION BY o.buyer_id ORDER BY o.order_date) AS order_seq
    FROM oms_orders o
    WHERE o.status IN ('confirmed', 'fulfilled')
      AND o.is_test = FALSE
),

buyer_stage AS (
    -- Collapse each buyer to their funnel milestones.
    SELECT
        bu.buyer_id,
        bu.reg_month,
        bu.region,
        bu.acquisition_channel,
        MAX(CASE WHEN o.order_seq >= 1 THEN 1 ELSE 0 END) AS activated,   -- placed 1st order
        MAX(CASE WHEN o.order_seq >= 2 THEN 1 ELSE 0 END) AS repeated,    -- placed 2nd order
        -- active = ordered within the recency window from metrics dictionary
        MAX(CASE WHEN o.order_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)  -- TODO window
                 THEN 1 ELSE 0 END)                       AS active_now,
        MIN(o.order_date)                                 AS activated_at,
        -- time-to-activate: friction proxy (days from register to first order)
        DATE_DIFF(MIN(o.order_date), MIN(bu.reg_month), DAY) AS days_to_activate  -- TODO dialect
    FROM buyers bu
    LEFT JOIN orders o USING (buyer_id)
    GROUP BY bu.buyer_id, bu.reg_month, bu.region, bu.acquisition_channel
)

-- FUNNEL ROLL-UP with step conversion. Segment by whatever you're testing
-- (region / channel / reg cohort). TODO: pick the segment that answers H3.
SELECT
    reg_month,
    region,                                              -- TODO: swap segment as needed
    COUNT(*)                                       AS registered,
    SUM(activated)                                 AS activated,
    SUM(repeated)                                  AS repeated,
    SUM(active_now)                                AS active_now,
    -- step conversion rates (the friction map)
    SAFE_DIVIDE(SUM(activated), COUNT(*))          AS reg_to_activation,   -- B1 core rate
    SAFE_DIVIDE(SUM(repeated),  SUM(activated))    AS activation_to_repeat,
    SAFE_DIVIDE(SUM(active_now), SUM(activated))   AS activation_to_active,
    -- friction timing
    APPROX_QUANTILES(days_to_activate, 100)[OFFSET(50)] AS median_days_to_activate  -- TODO dialect
FROM buyer_stage
GROUP BY reg_month, region
ORDER BY reg_month, region;

-- NOTES / EXTENSIONS:
--   * This is a LIFECYCLE funnel (people). For an ORDER funnel
--     (cart -> checkout -> paid) build a parallel query off Salla events.
--   * Low reg_to_activation with high median_days_to_activate => onboarding
--     friction (catalog, MOQ, payment terms). Feeds board-deck + memos.
--   * Cross-reference activation_to_repeat with cohort_retention.sql: they
--     should tell the same story about reorder health.
