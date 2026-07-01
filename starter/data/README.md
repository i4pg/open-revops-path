# data/ — your anonymized inputs live here

This folder is **git-ignored** (see `.gitignore`). The kit ships with **no real
data**. You populate it with **anonymized** extracts from your own systems
(SmartSuite / Salla / NetSuite + WMS). PDPL applies: never commit raw customer
PII (names, phones, emails, CRNs). Hash IDs and band/jitter sensitive figures.

## Layout
```
data/
  raw/          # untouched pulls (git-ignored) — anonymize FROM here
  private/      # anything with residual PII (git-ignored, never shared)
  sample_schema/  # column contracts / tiny fake CSVs (safe to commit)
  order_lines.parquet     # <- feeds 04-subsidy-waterfall & 03-analytics
  gmv_series.parquet      # <- feeds 06-forecast
  credit_training.parquet # <- feeds 05-credit-risk
```

## Anonymize before use
1. Pull raw (SmartSuite API, Salla reports/API, NetSuite saved searches) into `raw/`.
2. Hash `buyer_id` / `seller_id` (stable salted hash so joins still work).
3. Drop names, phones, emails, CRNs, addresses.
4. Optionally jitter/band amounts that could identify one account.
5. Write the cleaned files to `data/` using the contracts below.

## Column contracts (minimum viable)

### `order_lines.parquet` (grain = one order line)
`order_id, so_id, buyer_id, seller_id, category, region, order_date, qty,`
`list_price_sar, invoice_price_sar, cogs_sar, coupon_sar, shipping_charged_sar,`
`shipping_cost_sar, rebate_sar, mdf_sar, return_value_sar, claim_value_sar,`
`payment_amount_sar, days_to_pay, status, is_test`
> Re-consolidate the 30-line SO chunking on `so_id` before per-line math.

### `gmv_series.parquet` (grain = one period)
`period (date), gmv_sar` — regular frequency (weekly or monthly), no gaps.
Optionally add `region` / `category` if forecasting by segment.

### `credit_training.parquet` (grain = one buyer or one credit decision)
`buyer_id, region, buyer_segment, primary_category, payment_method,`
`tenure_days, trailing_90d_gmv, order_count_12m, avg_order_value,`
`max_dpd_12m, avg_dpd_12m, pct_invoices_late_12m, return_rate_12m,`
`credit_utilization, open_ar_sar, defaulted`
> All features must be knowable AT the decision point. `defaulted` (the target)
> is measured over a forward horizon — keep it out of the feature window.

## Reconcile
Before trusting any output, confirm GMV and active-buyer counts tie between the
OMS source of record and NetSuite per the rules in
`02-metrics-dictionary/metrics.yml`.
