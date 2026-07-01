-- cohort_retention.sql
-- Modules 1.2 (SQL: joins -> cohorts) and 1.6 (cohorts, segmentation, BI)
--
-- Buyer retention by acquisition cohort. Two views:
--   (1) LOGO retention  -> % of a cohort's buyers still ordering in month N
--   (2) VALUE retention -> GMV in month N vs the cohort's month-0 GMV (NRR-style)
--
-- Grain + definitions MUST match 02-metrics-dictionary/metrics.yml (gmv, active_buyer).
-- Dialect: ANSI-ish. date_trunc / date_diff may need tweaking (BigQuery vs Postgres).
-- TODO: replace object names with your warehouse's real tables/views.

WITH orders AS (
    -- One clean row per (buyer, order). Filter to QUALIFYING orders only,
    -- matching the `qualifying_order` rules in the metrics dictionary.
    SELECT
        o.buyer_id,
        o.order_id,
        DATE_TRUNC(o.order_date, MONTH)              AS order_month,   -- TODO dialect
        SUM(ol.qty * ol.unit_price_sar)              AS gmv_sar        -- gmv per order
    FROM oms_order_lines ol                                            -- TODO: source_of_record
    JOIN oms_orders o USING (order_id)
    WHERE o.status IN ('confirmed', 'fulfilled')      -- exclude cancelled
      AND o.is_test = FALSE                            -- exclude internal/test
    -- TODO: re-consolidate 30-line SO chunking here (group on original SO id)
    GROUP BY 1, 2, 3
),

first_order AS (
    -- Each buyer's acquisition cohort = month of their FIRST qualifying order.
    SELECT
        buyer_id,
        MIN(order_month) AS cohort_month
    FROM orders
    GROUP BY buyer_id
),

activity AS (
    -- Attach cohort + compute months-since-acquisition for every order month.
    SELECT
        o.buyer_id,
        f.cohort_month,
        o.order_month,
        -- period index: 0 = acquisition month, 1 = next month, ...
        DATE_DIFF(o.order_month, f.cohort_month, MONTH) AS period_index,  -- TODO dialect
        o.gmv_sar
    FROM orders o
    JOIN first_order f USING (buyer_id)
),

cohort_size AS (
    -- Denominators: buyers acquired and GMV booked in each cohort's month 0.
    SELECT
        cohort_month,
        COUNT(DISTINCT buyer_id)                          AS cohort_buyers,
        SUM(CASE WHEN period_index = 0 THEN gmv_sar END)  AS cohort_month0_gmv
    FROM activity
    GROUP BY cohort_month
),

retention AS (
    SELECT
        a.cohort_month,
        a.period_index,
        COUNT(DISTINCT a.buyer_id) AS retained_buyers,   -- logo retention numerator
        SUM(a.gmv_sar)             AS retained_gmv        -- value retention numerator
    FROM activity a
    GROUP BY a.cohort_month, a.period_index
)

SELECT
    r.cohort_month,
    r.period_index,
    s.cohort_buyers,
    r.retained_buyers,
    -- (1) logo retention: share of the original cohort still active in period N
    SAFE_DIVIDE(r.retained_buyers, s.cohort_buyers)        AS logo_retention,   -- TODO dialect
    -- (2) value retention: GMV in period N vs the cohort's month-0 GMV
    SAFE_DIVIDE(r.retained_gmv,    s.cohort_month0_gmv)    AS value_retention   -- NRR-style
FROM retention r
JOIN cohort_size s USING (cohort_month)
ORDER BY r.cohort_month, r.period_index;

-- HOW TO READ / EXTEND:
--   * Pivot period_index across columns for the classic triangle heatmap in BI.
--   * Segment: add category_first_order / region to cohort grain to compare
--     which segments decay fastest (feeds the liquidity + subsidy story).
--   * value_retention > 1.0 at period N = net expansion (reorder growth > churn).
--   TODO: decide monthly vs weekly cohorts based on reorder frequency.
