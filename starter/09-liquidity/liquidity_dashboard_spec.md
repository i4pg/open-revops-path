# Liquidity Instrumentation — Dashboard Spec (module 8.3)

Spec (not code) for the dashboard that instruments marketplace liquidity and
supply/demand balance. Build it after `02-metrics-dictionary` is settled — every
tile references a governed metric. Purpose: make the mandate's core idea visible
— efficient GMV = high liquidity at least friction + least subsidy.

## Audience & cadence
- **Primary:** CEO/CFO + RevOps. Weekly review; monthly board roll-up.
- **Refresh:** daily (ELT), with a freshness/last-refresh stamp on every tab.
- **Source of record per tile is mandatory** — no metric without lineage.

## Global filters
`date range` (default trailing 13 weeks) x `region` x `category` x
`buyer segment` x `seller tier`. Timezone: Asia/Riyadh.

---

## Metrics to instrument

### A. Liquidity core
| Metric | Definition (grain) | metrics.yml id | Source |
|---|---|---|---|
| GMV | booked value (order line) | `gmv` | SmartSuite OMS |
| Active buyers | distinct buyers ordering in window | `active_buyer` | OMS |
| Active sellers | distinct sellers with a sale in window | _TODO add_ | OMS |
| GMV per active buyer | gmv / active_buyer | _TODO derived_ | derived |
| Liquidity / match rate | orders filled / demand signals (search/RFQ) | _TODO_ | Salla + OMS |
| Fill rate | lines fulfilled / lines ordered | _TODO_ | WMS |

### B. Friction (demand & supply)
| Metric | Why it matters | Source |
|---|---|---|
| Registration -> activation rate | demand friction (B1) | Salla/OMS (see `03-`) |
| Median time-to-first-order | onboarding friction | OMS |
| Search-to-order rate | matching friction (B3) | Salla |
| Stockout / zero-result rate | supply-coverage gap | Salla/WMS |
| Seller onboarding cycle time | supply friction (B2) | SmartSuite |
| OTIF / return / claim rate | fulfillment friction (B4) | WMS/OMS |

### C. Subsidy efficiency
| Metric | Definition | Source |
|---|---|---|
| Subsidy per unit GMV | total leakage / GMV (from `04-` waterfall) | derived |
| Pocket margin % | pocket_margin / list_revenue | derived (`04-`) |
| Shipping subsidy rate | shipping cost - charged, / GMV | WMS/NetSuite |
| Incentive burn | buyer credits+coupons / GMV | OMS/Salla |

### D. Quality / concentration
| Metric | Definition | Source |
|---|---|---|
| Buyer concentration (HHI or top-10 % GMV) | fragility of demand | warehouse |
| Seller concentration | fragility of supply | warehouse |
| NRR / GRR, reorder rate | retention quality (`03-` cohorts) | warehouse |
| Credit-quality mix (score bands) | collectible GMV (`05-`) | NetSuite/model |

---

## Layout

**Tab 1 — Liquidity overview (exec).**
- Top KPI strip: GMV, active buyers, active sellers, GMV/active buyer,
  subsidy per unit GMV, pocket margin % — each with WoW/MoM delta + sparkline.
- Row 2: GMV trend (with forecast band from `06-`) | activation funnel (`03-`).
- Row 3: liquidity/fill rate | supply-demand balance (active buyers vs sellers).

**Tab 2 — Friction map.** Funnel + time-to-order + search-to-order + fulfillment
exceptions, sliceable by region/category to find where GMV leaks to friction.

**Tab 3 — Subsidy & margin.** Pocket-price waterfall (`04-`) + subsidy-per-GMV
by seller/category/basket-band, ranked worst-first (the prize list).

**Tab 4 — Concentration & quality.** HHI, top-N GMV share, cohort retention
triangle, credit-band mix. The "is this GMV durable and collectible?" view.

**Tab 5 — Data health.** OMS<->NetSuite GMV reconciliation delta, integration
drop counts (Make/n8n), freshness stamps. If this tab is red, don't trust the rest.

---

## Guardrails / alerts (TODO thresholds)
- Subsidy per unit GMV > _TODO_ -> alert RevOps.
- Activation rate drops > _TODO_ pts WoW -> alert.
- OMS vs NetSuite GMV delta > 1% -> block board roll-up until reconciled.

> TODO: confirm every window, threshold, and derived-metric formula against
> `02-metrics-dictionary/metrics.yml` before building. One definition, everywhere.
