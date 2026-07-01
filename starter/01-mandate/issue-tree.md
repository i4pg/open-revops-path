# Sales-Efficiency Mandate — Issue Tree

Frame the CEO/CFO mandate before you touch data. This is a **hypothesis-driven,
MECE** decomposition (module 10.1) of the sales-efficiency question (module 0.1).
Work top-down: sharpen the question, break it into mutually-exclusive branches,
attach a falsifiable hypothesis + the data you'd need to each leaf.

---

## 0. The question (make it sharp and answerable)

> **TODO:** Rewrite the vague ask ("improve sales efficiency") as one decision
> the CEO/CFO must make, with a metric, a target, and a deadline.
>
> Working definition: `sales efficiency = liquidity efficiency`
> `= GMV generated per unit of friction + subsidy`.
> So the real question is usually: *"Where is GMV being bought with too much
> subsidy or lost to too much friction, and what do we stop/start/change?"*

**Decision owner:** _TODO_  **Success metric:** _TODO_  **By when:** _TODO_

---

## 1. Issue tree (MECE)

```
Are we generating GMV efficiently? (least subsidy + least friction per unit GMV)
|
|-- A. Are we SUBSIDIZING too much per unit of GMV?
|     |-- A1. Buyer-side incentives (coupons, first-order, referral credit)
|     |-- A2. Shipping / logistics subsidy (free or below-cost delivery)
|     |-- A3. Trade-credit cost (financing buyers who pay late / default)
|     |-- A4. Off-invoice leakage (rebates, MDF, claims, returns, payment fees)
|     \-- A5. Take-rate given away in negotiation / deal desk
|
|-- B. Is FRICTION costing us GMV we should be capturing?
|     |-- B1. Demand friction: registration -> activation -> first order
|     |-- B2. Supply friction: seller onboarding, catalog/product-data quality
|     |-- B3. Matching friction: search-to-order, fill rate, stockouts
|     |-- B4. Fulfillment friction: OTIF, returns, claims, WMS exceptions
|     \-- B5. Ops friction: manual re-keying across SmartSuite/Salla/NetSuite
|
|-- C. Is the MIX of GMV low-quality? (efficient GMV != all GMV)
|     |-- C1. Concentration risk (few buyers/sellers = fragile GMV)
|     |-- C2. Retention / reorder quality (NRR, GRR, cohort decay)
|     |-- C3. Category / margin mix (GMV that never pockets margin)
|     \-- C4. Credit quality of the GMV (collectible vs written off)
|
\-- D. Do we even MEASURE it right? (instrumentation gap)
      |-- D1. Governed metric definitions (GMV, active buyer) agreed?
      |-- D2. CRM (SmartSuite) <-> ERP (NetSuite) reconciliation clean?
      \-- D3. Subsidy + friction actually attributable to an order line?
```

> **TODO:** Prune/extend so branches are genuinely mutually exclusive and
> collectively exhaustive for *your* business. Delete what doesn't apply.

---

## 2. Hypotheses (attach one per leaf you'll actually test)

| # | Branch | Hypothesis (falsifiable) | Data needed | Source | Size of prize |
|---|--------|--------------------------|-------------|--------|---------------|
| H1 | A2 | > TODO e.g. "Shipping subsidy on sub-SAR-X baskets destroys pocket margin" | order lines + freight cost | NetSuite/WMS | TODO |
| H2 | A3 | > TODO | AR aging, DPD | NetSuite | TODO |
| H3 | B1 | > TODO | activation funnel | Salla/SmartSuite | TODO |
| H4 | C1 | > TODO | buyer GMV concentration | warehouse | TODO |
| H5 | D2 | > TODO | GMV recon delta | both | TODO |

> Rank by **size of prize x confidence x speed-to-answer**. Test the top 2-3
> first. Everything downstream in this kit (waterfall, credit model, forecast,
> deck) should serve a hypothesis on this list.

---

## 3. So-what / storyline seed (feeds `08-board-deck/`)

- **Situation:** _TODO one line_
- **Complication:** _TODO one line — the efficiency leak_
- **Question:** _TODO the decision_
- **Answer (hypothesis):** _TODO — what you'll recommend if H_x holds_
