from pathlib import Path

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


def load_data(path: str) -> pd.DataFrame:
    """Load raw production data from CSV, resolving relative to project root if needed."""
    file_path = Path(path)
    if not file_path.is_file():
        alt_path = Path(__file__).resolve().parent.parent / path
        if alt_path.is_file():
            file_path = alt_path
    return pd.read_csv(file_path)


def remove_outliers_iqr(df: pd.DataFrame, numeric_cols, whisker_width: float = 1.5) -> pd.DataFrame:
    """Remove rows with numeric values outside an IQR-based whisker."""
    cleaned = df.copy()
    for col in numeric_cols:
        q1 = cleaned[col].quantile(0.25)
        q3 = cleaned[col].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - whisker_width * iqr
        upper = q3 + whisker_width * iqr
        cleaned = cleaned[(cleaned[col] >= lower) & (cleaned[col] <= upper)]
    return cleaned.reset_index(drop=True)


def make_preprocessor():
    """Build preprocessing pipeline with scaling for numeric and one-hot for categorical."""
    numeric_features = ["temperature", "line_speed", "operator_experience", "machine_age"]
    categorical_features = ["shift"]

    numeric_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    categorical_pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore")),
        ]
    )

    return ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numeric_features),
            ("cat", categorical_pipeline, categorical_features),
        ]
    )


def get_feature_names(preprocessor: ColumnTransformer):
    """Return feature names after preprocessing for downstream importance plots."""
    cat_features = preprocessor.transformers_[1][2]
    encoded_cats = list(preprocessor.named_transformers_["cat"]["encoder"].get_feature_names_out(cat_features))
    num_features = list(preprocessor.transformers_[0][2])
    return num_features + encoded_cats
