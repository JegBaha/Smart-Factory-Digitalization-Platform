from pathlib import Path
import pandas as pd


DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def load_mes(path: str | Path = DATA_DIR / "mes.csv") -> pd.DataFrame:
    """Load MES execution data with parsed timestamps."""
    df = pd.read_csv(path)
    df["start_time"] = pd.to_datetime(df["start_time"])
    df["end_time"] = pd.to_datetime(df["end_time"])
    return df


def load_erp(path: str | Path = DATA_DIR / "erp.csv") -> pd.DataFrame:
    """Load ERP planning data with parsed timestamps."""
    df = pd.read_csv(path)
    df["planned_start"] = pd.to_datetime(df["planned_start"])
    df["planned_end"] = pd.to_datetime(df["planned_end"])
    return df


if __name__ == "__main__":
    mes = load_mes()
    erp = load_erp()
    print("MES sample:", mes.head(), sep="\n")
    print("ERP sample:", erp.head(), sep="\n")
