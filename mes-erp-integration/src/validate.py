import logging
from pathlib import Path
import pandas as pd

RESULTS_DIR = Path(__file__).resolve().parent.parent / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
LOG_PATH = RESULTS_DIR / "validation.log"

logging.basicConfig(
    filename=LOG_PATH,
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)


def validate_mes(df: pd.DataFrame) -> list[str]:
    errors = []
    if df["order_id"].isna().any():
        errors.append("MES: missing order_id")
    if (df["produced_qty"] < 0).any():
        errors.append("MES: negative produced_qty")
    if (df["defect_qty"] < 0).any():
        errors.append("MES: negative defect_qty")
    if (df["end_time"] < df["start_time"]).any():
        errors.append("MES: end_time before start_time")
    return errors


def validate_erp(df: pd.DataFrame) -> list[str]:
    errors = []
    if df["order_id"].isna().any():
        errors.append("ERP: missing order_id")
    if (df["planned_qty"] < 0).any():
        errors.append("ERP: negative planned_qty")
    if (df["planned_end"] < df["planned_start"]).any():
        errors.append("ERP: planned_end before planned_start")
    return errors


def log_errors(errors: list[str]) -> None:
    if not errors:
        logging.info("Validation passed with no errors")
        return
    for err in errors:
        logging.error(err)


if __name__ == "__main__":
    from load import load_mes, load_erp

    mes = load_mes()
    erp = load_erp()
    errs = validate_mes(mes) + validate_erp(erp)
    log_errors(errs)
    print("Errors logged to", LOG_PATH)
