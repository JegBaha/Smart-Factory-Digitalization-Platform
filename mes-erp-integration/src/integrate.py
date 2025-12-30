from pathlib import Path
import pandas as pd

from load import load_mes, load_erp
from validate import log_errors, validate_mes, validate_erp

RESULTS_DIR = Path(__file__).resolve().parent.parent / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)


def build_unified_table(mes_path: str | Path = None, erp_path: str | Path = None) -> pd.DataFrame:
    mes = load_mes(mes_path) if mes_path else load_mes()
    erp = load_erp(erp_path) if erp_path else load_erp()

    errors = validate_mes(mes) + validate_erp(erp)
    log_errors(errors)

    unified = pd.merge(
        erp,
        mes,
        on="order_id",
        how="inner",
        suffixes=("_plan", "_actual"),
    )
    unified["plan_fulfillment"] = unified["produced_qty"] / unified["planned_qty"]
    unified["delay_hours"] = (unified["end_time"] - unified["planned_end"]).dt.total_seconds() / 3600
    unified["scrap_rate"] = unified["defect_qty"] / unified["produced_qty"].replace(0, pd.NA)
    return unified


def save_unified(unified: pd.DataFrame, path: str | Path = RESULTS_DIR / "unified.csv") -> Path:
    unified.to_csv(path, index=False)
    return Path(path)


if __name__ == "__main__":
    df = build_unified_table()
    out_path = save_unified(df)
    print(f"Unified table saved to {out_path}")
