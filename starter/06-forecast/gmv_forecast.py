"""GMV time-series forecasting (module 7.2).

Skeleton for forecasting marketplace GMV with a rolling-origin backtest and
MAPE/WAPE accuracy. Two interchangeable model backends are stubbed:
  * statsmodels SARIMAX (seasonal ARIMA with optional exogenous regressors)
  * Prophet (trend + seasonality + holidays; good for Ramadan/Eid/promo effects)

GMV must be the governed metric from 02-metrics-dictionary/metrics.yml.
Forecast at a chosen grain (total, per-category, per-region) — TODO decide.
"""
from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd

# Optional deps — import lazily so the file loads even if one isn't installed.
try:
    from statsmodels.tsa.statespace.sarimax import SARIMAX
except Exception:  # pragma: no cover
    SARIMAX = None
try:
    from prophet import Prophet
except Exception:  # pragma: no cover
    Prophet = None


@dataclass
class ForecastConfig:
    date_col: str = "period"          # e.g. weekly or monthly bucket
    target_col: str = "gmv_sar"
    freq: str = "W"                   # TODO: W (weekly) or M (monthly)
    horizon: int = 8                  # periods to forecast
    backend: str = "sarima"           # "sarima" | "prophet"
    seasonal_periods: int = 52        # 52 weekly / 12 monthly


# --------------------------- accuracy metrics ---------------------------
def mape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Mean Absolute Percentage Error. Undefined near zero — use with care."""
    y_true, y_pred = np.asarray(y_true, float), np.asarray(y_pred, float)
    mask = y_true != 0
    return float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])))


def wape(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """Weighted APE = sum|err| / sum|actual|. Robust for spiky GMV; prefer this."""
    y_true, y_pred = np.asarray(y_true, float), np.asarray(y_pred, float)
    denom = np.sum(np.abs(y_true))
    return float(np.sum(np.abs(y_true - y_pred)) / denom) if denom else float("nan")


# --------------------------- data prep ---------------------------
def load_series(path: str, cfg: ForecastConfig) -> pd.Series:
    """Load and regularize the GMV series to a fixed frequency.

    Return a Series indexed by a complete DatetimeIndex at cfg.freq with no gaps
    (fill missing periods with 0 or interpolate — decide deliberately).
    """
    # TODO: read; groupby period; asfreq(cfg.freq); handle missing periods.
    raise NotImplementedError


# --------------------------- model backends ---------------------------
def fit_predict_sarima(train: pd.Series, horizon: int, cfg: ForecastConfig) -> pd.Series:
    """SARIMAX one-shot forecast. TODO: choose (p,d,q)(P,D,Q,s) via AIC/ACF."""
    if SARIMAX is None:
        raise ImportError("pip install statsmodels")
    # TODO: model = SARIMAX(train, order=(1,1,1), seasonal_order=(1,1,1,cfg.seasonal_periods))
    #       res = model.fit(disp=False); return res.forecast(horizon)
    raise NotImplementedError


def fit_predict_prophet(train: pd.Series, horizon: int, cfg: ForecastConfig) -> pd.Series:
    """Prophet forecast. TODO: add Ramadan/Eid + promo events as holidays/regressors."""
    if Prophet is None:
        raise ImportError("pip install prophet")
    # TODO: df = train.reset_index(); df.columns = ['ds','y']
    #       m = Prophet(...); m.add_country_holidays('SA') or custom KSA calendar
    #       m.fit(df); future = m.make_future_dataframe(horizon, freq=cfg.freq)
    #       return m.predict(future)['yhat'].tail(horizon)
    raise NotImplementedError


def forecast(train: pd.Series, cfg: ForecastConfig) -> pd.Series:
    if cfg.backend == "sarima":
        return fit_predict_sarima(train, cfg.horizon, cfg)
    if cfg.backend == "prophet":
        return fit_predict_prophet(train, cfg.horizon, cfg)
    raise ValueError(f"unknown backend {cfg.backend}")


# --------------------------- backtest ---------------------------
def rolling_origin_backtest(series: pd.Series, cfg: ForecastConfig, n_folds: int = 4) -> pd.DataFrame:
    """Walk-forward (expanding-window) backtest — the honest accuracy check.

    For each fold: train on everything up to a cutoff, forecast cfg.horizon
    ahead, compare to actuals, record MAPE + WAPE. Never let test leak into train.

    Returns a DataFrame: one row per fold with mape, wape, cutoff.
    """
    rows: list[dict] = []
    total = len(series)
    # TODO: for each of n_folds, set an expanding cutoff, forecast, score.
    # Skeleton loop (fill the body):
    for fold in range(n_folds):
        # cutoff = total - (n_folds - fold) * cfg.horizon
        # train, actual = series.iloc[:cutoff], series.iloc[cutoff:cutoff+cfg.horizon]
        # pred = forecast(train, cfg)
        # rows.append({"fold": fold, "mape": mape(actual, pred), "wape": wape(actual, pred)})
        pass  # TODO
    return pd.DataFrame(rows)


def main(path: str) -> None:
    cfg = ForecastConfig()
    series = load_series(path, cfg)
    scores = rolling_origin_backtest(series, cfg)
    print("Backtest:\n", scores)
    print("Mean WAPE:", scores["wape"].mean() if not scores.empty else "TODO")
    future = forecast(series, cfg)   # final forecast on full history
    print(future)                    # TODO: hand to planning / board deck


if __name__ == "__main__":
    import sys

    main(sys.argv[1] if len(sys.argv) > 1 else "data/gmv_series.parquet")
