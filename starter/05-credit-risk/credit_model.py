"""Trade-Credit Risk & Collections model (module 5.5).

Scikit-learn skeleton to score a buyer's probability of default / serious
delinquency on trade credit, calibrate that probability, cut it into A-E score
bands, and translate into a recommended credit limit. All modeling logic is a
TODO stub.

Target definition matters most: agree it with the CFO BEFORE coding.
  Default = e.g. any invoice > 90 DPD (days past due) within a 12-month horizon.
Avoid leakage: features must be knowable AT the decision point (order/credit
grant), never after. No post-hoc payment info in the feature set.
"""
from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

TARGET = "defaulted"  # 1 = >90 DPD within horizon; TODO confirm with finance


@dataclass
class FeatureSpec:
    """Point-in-time features (all must be knowable at credit-decision time)."""
    numeric: list[str] = field(default_factory=lambda: [
        "tenure_days",            # how long the buyer has transacted
        "trailing_90d_gmv",       # recent volume
        "order_count_12m",        # frequency
        "avg_order_value",
        "max_dpd_12m",            # worst past-due days historically (behavioral)
        "avg_dpd_12m",
        "pct_invoices_late_12m",
        "return_rate_12m",        # disputes/returns as a stress signal
        "credit_utilization",     # outstanding AR / current limit
        "open_ar_sar",
    ])
    categorical: list[str] = field(default_factory=lambda: [
        "region",
        "buyer_segment",          # ICP tier / size band
        "primary_category",
        "payment_method",
    ])


def load_training_frame(path: str) -> pd.DataFrame:
    """Load one row per buyer (or per credit decision) with features + TARGET.

    Build features from NetSuite AR aging + SmartSuite order history, snapshotted
    at the decision date. See data/README.md for the credit table contract.
    """
    # TODO: read data; assert no future information leaks into features.
    raise NotImplementedError


def build_pipeline(spec: FeatureSpec) -> Pipeline:
    """Preprocess + classifier pipeline. Swap the estimator freely."""
    pre = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), spec.numeric),
            ("cat", OneHotEncoder(handle_unknown="ignore"), spec.categorical),
        ]
    )
    # TODO: tune; GBM is a sane default for tabular credit data.
    clf = GradientBoostingClassifier(random_state=42)
    return Pipeline([("pre", pre), ("clf", clf)])


def train(df: pd.DataFrame, spec: FeatureSpec) -> tuple[Pipeline, pd.DataFrame]:
    """Split, fit, return the fitted (uncalibrated) pipeline + held-out test set.

    IMPORTANT: split by TIME or by buyer, not randomly across a buyer's rows,
    or you leak. Report AUC / KS / precision-recall on the held-out set.
    """
    features = spec.numeric + spec.categorical
    X_train, X_test, y_train, y_test = train_test_split(
        df[features], df[TARGET], test_size=0.25, random_state=42, stratify=df[TARGET]
    )
    pipe = build_pipeline(spec)
    pipe.fit(X_train, y_train)
    # TODO: evaluate — roc_auc_score, KS statistic, PR curve; log them.
    test = X_test.copy()
    test[TARGET] = y_test.values
    return pipe, test


def calibrate(pipe: Pipeline, df: pd.DataFrame, spec: FeatureSpec) -> CalibratedClassifierCV:
    """Calibrate scores so predicted PD ~= observed default rate.

    A ranking model isn't enough for credit — you set limits off the probability,
    so it must be calibrated. Use isotonic (enough data) or sigmoid (sparse).
    """
    features = spec.numeric + spec.categorical
    calibrated = CalibratedClassifierCV(pipe, method="isotonic", cv="prefit")
    # TODO: fit on a held-out calibration slice, then check a reliability curve.
    calibrated.fit(df[features], df[TARGET])
    return calibrated


def score_bands(pd_scores: pd.Series) -> pd.Series:
    """Cut calibrated PD into A-E risk bands (A safest).

    TODO: set thresholds from the business's risk appetite + the observed PD
    distribution, NOT arbitrary round numbers. Bands should map to policy:
      A -> auto-approve, higher limit / longer terms
      B -> approve, standard terms
      C -> approve with reduced limit / shorter terms
      D -> manual deal-desk review
      E -> prepay / no trade credit
    """
    # TODO: pd.cut(pd_scores, bins=[...], labels=list("EDCBA"))
    raise NotImplementedError


def recommend_limit(df: pd.DataFrame, pd_scores: pd.Series) -> pd.Series:
    """Translate PD + exposure into a recommended credit limit per buyer.

    Simple expected-loss-guarded starting point (refine with finance):
        base_limit  = k * trailing_90d_gmv           # capacity to transact
        risk_factor = 1 - min(pd * loss_given_default / risk_budget, 1)
        limit       = base_limit * risk_factor
    """
    # TODO: implement; cap by segment policy; never exceed CFO ceiling.
    raise NotImplementedError


def main(path: str) -> None:
    spec = FeatureSpec()
    df = load_training_frame(path)
    pipe, test = train(df, spec)
    model = calibrate(pipe, test, spec)

    features = spec.numeric + spec.categorical
    pd_scores = pd.Series(model.predict_proba(df[features])[:, 1], index=df.index)
    result = df[["buyer_id"]].copy()
    result["pd"] = pd_scores
    result["band"] = score_bands(pd_scores)
    result["recommended_limit"] = recommend_limit(df, pd_scores)
    print(result.head())  # TODO: write back to SmartSuite / deal desk


if __name__ == "__main__":
    import sys

    main(sys.argv[1] if len(sys.argv) > 1 else "data/credit_training.parquet")
