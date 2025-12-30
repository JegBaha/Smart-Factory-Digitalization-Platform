from dataclasses import dataclass
from typing import Tuple

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from preprocess import load_data, make_preprocessor, remove_outliers_iqr

DATA_PATH = "data/production_data.csv"


@dataclass
class ModelBundle:
    name: str
    pipeline: Pipeline
    auc: float
    report: str


def prepare_dataset(path: str) -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series, Pipeline]:
    """Load, clean, encode, and split the dataset."""
    df = load_data(path)
    numeric_cols = ["temperature", "line_speed", "operator_experience", "machine_age"]
    df_clean = remove_outliers_iqr(df, numeric_cols)

    X = df_clean.drop(columns=["defect"])
    y = df_clean["defect"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    preprocessor = make_preprocessor()
    return X_train, X_test, y_train, y_test, preprocessor


def train_and_evaluate(path: str = DATA_PATH) -> Tuple[ModelBundle, ModelBundle]:
    X_train, X_test, y_train, y_test, preprocessor = prepare_dataset(path)

    log_reg = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            (
                "model",
                LogisticRegression(
                    max_iter=600,
                    class_weight="balanced",
                    penalty="l2",
                    solver="lbfgs",
                ),
            ),
        ]
    )

    rf = Pipeline(
        steps=[
            ("preprocess", make_preprocessor()),
            (
                "model",
                RandomForestClassifier(
                    n_estimators=300,
                    max_depth=12,
                    min_samples_split=4,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )

    log_reg.fit(X_train, y_train)
    rf.fit(X_train, y_train)

    lr_proba = log_reg.predict_proba(X_test)[:, 1]
    rf_proba = rf.predict_proba(X_test)[:, 1]

    lr_auc = roc_auc_score(y_test, lr_proba)
    rf_auc = roc_auc_score(y_test, rf_proba)

    lr_report = classification_report(y_test, log_reg.predict(X_test))
    rf_report = classification_report(y_test, rf.predict(X_test))

    return (
        ModelBundle("Logistic Regression", log_reg, lr_auc, lr_report),
        ModelBundle("Random Forest", rf, rf_auc, rf_report),
    )


if __name__ == "__main__":
    lr_bundle, rf_bundle = train_and_evaluate()
    print(f"{lr_bundle.name} AUC: {lr_bundle.auc:.3f}")
    print(lr_bundle.report)
    print(f"{rf_bundle.name} AUC: {rf_bundle.auc:.3f}")
    print(rf_bundle.report)
