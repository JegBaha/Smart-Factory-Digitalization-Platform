from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from integrate import build_unified_table, save_unified

RESULTS_DIR = Path(__file__).resolve().parent.parent / "results"
RESULTS_DIR.mkdir(parents=True, exist_ok=True)
PLOT_PATH = RESULTS_DIR / "plan_vs_actual.png"


def compute_kpis(unified: pd.DataFrame) -> dict:
    kpis = {
        "plan_fulfillment_mean": (unified["produced_qty"] / unified["planned_qty"]).mean(),
        "delay_hours_mean": (unified["end_time"] - unified["planned_end"]).dt.total_seconds().mean() / 3600,
        "scrap_rate_mean": (unified["defect_qty"] / unified["produced_qty"].replace(0, pd.NA)).mean(),
    }
    return kpis


def plot_plan_vs_actual(unified: pd.DataFrame, out_path: Path = PLOT_PATH) -> Path:
    sample = unified.copy()
    sample["planned_end_date"] = sample["planned_end"].dt.date

    plt.figure(figsize=(9, 5))
    sns.lineplot(data=sample, x="planned_end_date", y="planned_qty", label="Planned qty")
    sns.lineplot(data=sample, x="planned_end_date", y="produced_qty", label="Produced qty")
    plt.title("Planned vs Actual Production")
    plt.xlabel("Planned end date")
    plt.ylabel("Quantity")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()
    return out_path


def run_pipeline():
    unified = build_unified_table()
    save_unified(unified)
    kpis = compute_kpis(unified)
    plot_path = plot_plan_vs_actual(unified)
    print("KPIs:", kpis)
    print(f"Plot saved to {plot_path}")
    return kpis, plot_path


if __name__ == "__main__":
    run_pipeline()
