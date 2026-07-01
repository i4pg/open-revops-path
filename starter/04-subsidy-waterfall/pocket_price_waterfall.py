"""Pocket-Price & Margin-Leakage Waterfall (FLAGSHIP, module 5.3).

Builds the list-price -> pocket-price bridge at the order-line grain, then rolls
leakage up so you can see where subsidy and margin actually vanish. Each function
below is ONE STEP of the bridge and is intentionally a TODO stub.

The bridge (buyer-price view, marketplace-adapted):

    List revenue (qty x list price)
      - On-invoice discounts .......... A5 negotiated / A1 promo shown on invoice
      = Invoice price
      - Off-invoice leakage ........... A1-A4 subsidies that never hit the invoice:
            * buyer incentives / credits (coupons, first-order, referral)
            * shipping / freight subsidy (below-cost delivery)
            * trade-credit / financing cost (cost of carrying late payers)
            * rebates / MDF / co-op marketing
            * returns & claims
            * payment-processing fees
      = Pocket price   (what the marketplace effectively realizes)
      - COGS / seller payout
      = Pocket margin

Data contract: see data/README.md (order_lines + subsidy tables).
Definitions (gmv, net_gmv, take_rate) MUST match 02-metrics-dictionary/metrics.yml.
"""
from __future__ import annotations

from dataclasses import dataclass
import pandas as pd

# Canonical bridge step order (used for plotting + reconciliation).
BRIDGE_STEPS = [
    "list_revenue",
    "on_invoice_discount",
    "invoice_price",
    "buyer_incentive",
    "shipping_subsidy",
    "trade_credit_cost",
    "rebate_mdf",
    "returns_claims",
    "payment_fees",
    "pocket_price",
    "cogs_payout",
    "pocket_margin",
]


@dataclass
class WaterfallConfig:
    # TODO: set these from finance (NetSuite) — do not guess in the model.
    trade_credit_apr: float = 0.0        # annualized cost of capital for AR carry
    payment_fee_rate: float = 0.0        # blended gateway fee as share of invoice
    freight_cost_source: str = "wms"     # where actual delivery cost comes from


def load_line_items(path: str) -> pd.DataFrame:
    """Step 0 — load order lines + all subsidy components to one grain.

    Expected columns (see data/README.md), one row per order line:
        order_id, buyer_id, seller_id, category, region, qty,
        list_price_sar, invoice_price_sar, cogs_sar,
        coupon_sar, shipping_charged_sar, shipping_cost_sar,
        rebate_sar, mdf_sar, return_value_sar, claim_value_sar,
        payment_amount_sar, days_to_pay
    """
    # TODO: read parquet/csv; enforce dtypes; re-consolidate 30-line SO chunks
    # (group split lines back to the original SO before any per-line math).
    raise NotImplementedError


def compute_list_revenue(df: pd.DataFrame) -> pd.DataFrame:
    """Step 1 — list_revenue = qty * list_price_sar (top of the bridge = GMV)."""
    # TODO: df["list_revenue"] = df["qty"] * df["list_price_sar"]
    raise NotImplementedError


def apply_on_invoice_discounts(df: pd.DataFrame) -> pd.DataFrame:
    """Step 2 — subtract discounts SHOWN on the invoice -> invoice_price.

    on_invoice_discount = list_revenue - (qty * invoice_price_sar)
    """
    # TODO: compute on_invoice_discount and invoice_price columns.
    raise NotImplementedError


def apply_off_invoice_leakage(df: pd.DataFrame, cfg: WaterfallConfig) -> pd.DataFrame:
    """Step 3 — the subsidy buckets that never appear on the invoice.

    Populate each as a POSITIVE leakage amount (SAR) per line:
        buyer_incentive   = coupon_sar + referral/first-order credit
        shipping_subsidy  = max(shipping_cost_sar - shipping_charged_sar, 0)
        trade_credit_cost = payment_amount_sar * cfg.trade_credit_apr
                            * (days_to_pay / 365)          # cost of carrying AR
        rebate_mdf        = rebate_sar + mdf_sar
        returns_claims    = return_value_sar + claim_value_sar
        payment_fees      = payment_amount_sar * cfg.payment_fee_rate
    """
    # TODO: create the six leakage columns above. Keep each a separate column so
    # segment_leakage() can attribute the prize to a specific lever.
    raise NotImplementedError


def compute_pocket_price(df: pd.DataFrame) -> pd.DataFrame:
    """Step 4 — pocket_price = invoice_price - sum(off-invoice leakage buckets)."""
    # TODO: sum the leakage columns from step 3 and subtract from invoice_price.
    raise NotImplementedError


def compute_pocket_margin(df: pd.DataFrame) -> pd.DataFrame:
    """Step 5 — pocket_margin = pocket_price - cogs/seller payout.

    Also derive pocket_margin_pct = pocket_margin / list_revenue so you can rank
    where a SAR of GMV pockets almost nothing (negative-margin GMV = the leak).
    """
    # TODO: pocket_margin and pocket_margin_pct columns.
    raise NotImplementedError


def build_waterfall_bridge(df: pd.DataFrame) -> pd.Series:
    """Step 6 — aggregate to the presentable bridge (one number per BRIDGE_STEP).

    Returns a Series indexed by BRIDGE_STEPS with signed deltas suitable for a
    waterfall chart. Reconcile: list_revenue - all leakage - cogs == pocket_margin.
    """
    # TODO: sum each component; assert the bridge closes (within rounding).
    raise NotImplementedError


def segment_leakage(df: pd.DataFrame, by: str) -> pd.DataFrame:
    """Step 7 — attribute leakage to a lever/segment (seller, category, region,
    buyer, basket-size band). This is where the recommendation comes from.

    Return: total_gmv, total leakage by bucket, pocket_margin, subsidy_per_gmv,
    ordered by worst subsidy_per_gmv first.
    """
    # TODO: groupby `by`; compute subsidy_per_gmv = total_leakage / list_revenue.
    raise NotImplementedError


def main(path: str) -> None:
    cfg = WaterfallConfig()  # TODO: load real rates from finance
    df = load_line_items(path)
    for step in (
        compute_list_revenue,
        apply_on_invoice_discounts,
    ):
        df = step(df)
    df = apply_off_invoice_leakage(df, cfg)
    df = compute_pocket_price(df)
    df = compute_pocket_margin(df)

    bridge = build_waterfall_bridge(df)
    worst_sellers = segment_leakage(df, by="seller_id")
    print(bridge)          # TODO: hand off to plotting / board deck
    print(worst_sellers.head(10))


if __name__ == "__main__":
    import sys

    main(sys.argv[1] if len(sys.argv) > 1 else "data/order_lines.parquet")
