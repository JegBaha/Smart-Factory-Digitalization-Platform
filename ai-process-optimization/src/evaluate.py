from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from preprocess import get_feature_names, load_data, remove_outliers_iqr
from train import DATA_PATH, train_and_evaluate

RESULTS_DIR = Path("results")


def plot_feature_importance(model_bundle, out_path: Path):
    """Plot feature importance for a fitted model."""
    pipeline = model_bundle.pipeline
    preprocessor = pipeline.named_steps["preprocess"]
    model = pipeline.named_steps["model"]

    feature_names = get_feature_names(preprocessor)

    if hasattr(model, "coef_"):
        importances = abs(model.coef_[0])
    elif hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        raise ValueError("Model does not expose feature importances.")

    fi = pd.DataFrame({"feature": feature_names, "importance": importances})
    fi = fi.sort_values(by="importance", ascending=False)

    plt.figure(figsize=(8, 5))
    sns.barplot(data=fi, x="importance", y="feature", palette="viridis")
    plt.title(f"{model_bundle.name} Feature Importance")
    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()
    return fi


def plot_temperature_curve(model_bundle, data_path: str, out_path: Path):
    """Plot predicted vs actual defect probability across temperature bins."""
    df = load_data(data_path)
    df = remove_outliers_iqr(df, ["temperature", "line_speed", "operator_experience", "machine_age"])

    X = df.drop(columns=["defect"])
    df["pred_defect_prob"] = model_bundle.pipeline.predict_proba(X)[:, 1]
    df["temp_bin"] = pd.cut(df["temperature"], bins=12)

    grouped = (
        df.groupby("temp_bin")
        .agg(pred_prob=("pred_defect_prob", "mean"), actual_rate=("defect", "mean"))
        .reset_index()
    )
    grouped["temp_center"] = grouped["temp_bin"].apply(lambda b: (b.left + b.right) / 2)

    plt.figure(figsize=(8, 5))
    sns.lineplot(data=grouped, x="temp_center", y="pred_prob", label="Predicted defect prob")
    sns.lineplot(data=grouped, x="temp_center", y="actual_rate", label="Observed defect rate")
    plt.xlabel("Temperature (°C)")
    plt.ylabel("Defect probability")
    plt.title("Temperature vs defect probability")
    plt.tight_layout()
    plt.savefig(out_path, dpi=150)
    plt.close()


def run_evaluation(data_path: str = DATA_PATH):
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)

    lr_bundle, rf_bundle = train_and_evaluate(data_path)
    # Random Forest tends to capture non-linear interactions, so use it for importance.
    fi = plot_feature_importance(rf_bundle, RESULTS_DIR / "feature_importance.png")
    plot_temperature_curve(rf_bundle, data_path, RESULTS_DIR / "temperature_vs_defect.png")

    print(f"Logistic Regression AUC: {lr_bundle.auc:.3f}")
    print(lr_bundle.report)
    print(f"Random Forest AUC: {rf_bundle.auc:.3f}")
    print(rf_bundle.report)
    print("\nTop feature importances (Random Forest):")
    print(fi.head(10))
    print("\nSaved plots to results/.")


if __name__ == "__main__":
    run_evaluation()
