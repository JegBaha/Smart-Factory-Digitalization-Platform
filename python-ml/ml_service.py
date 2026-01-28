import pandas as pd
import numpy as np
import joblib
from pathlib import Path
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, classification_report


class MLService:
    def __init__(self, model_dir: str = "models"):
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        self.model: Pipeline = None
        self.feature_importance: dict = {}
        self._load_model()

    def is_loaded(self) -> bool:
        return self.model is not None

    def _load_model(self):
        rf_path = self.model_dir / "random_forest.pkl"
        if rf_path.exists():
            self.model = joblib.load(rf_path)
            self._extract_feature_importance()
        else:
            # Train initial model if not exists
            data_path = Path(__file__).parent.parent / "ai-process-optimization" / "data" / "production_data.csv"
            if data_path.exists():
                self.train(str(data_path))

    def _make_preprocessor(self):
        numeric_features = ["temperature", "line_speed", "operator_experience", "machine_age"]
        categorical_features = ["shift"]

        numeric_transformer = Pipeline(steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler())
        ])

        categorical_transformer = Pipeline(steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
        ])

        return ColumnTransformer(transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features)
        ])

    def _get_feature_names(self, preprocessor):
        numeric_features = ["temperature", "line_speed", "operator_experience", "machine_age"]
        cat_encoder = preprocessor.named_transformers_["cat"].named_steps["encoder"]
        cat_features = cat_encoder.get_feature_names_out(["shift"]).tolist()
        return numeric_features + cat_features

    def _extract_feature_importance(self):
        if self.model is None:
            return
        try:
            preprocessor = self.model.named_steps["preprocess"]
            model = self.model.named_steps["model"]
            feature_names = self._get_feature_names(preprocessor)
            if hasattr(model, "feature_importances_"):
                self.feature_importance = dict(zip(feature_names, model.feature_importances_.tolist()))
        except Exception:
            pass

    def _remove_outliers_iqr(self, df, numeric_cols, whisker_width=1.5):
        df_clean = df.copy()
        for col in numeric_cols:
            Q1 = df_clean[col].quantile(0.25)
            Q3 = df_clean[col].quantile(0.75)
            IQR = Q3 - Q1
            lower = Q1 - whisker_width * IQR
            upper = Q3 + whisker_width * IQR
            df_clean = df_clean[(df_clean[col] >= lower) & (df_clean[col] <= upper)]
        return df_clean

    def predict(self, temperature: float, line_speed: float, shift: str,
                operator_experience: float, machine_age: float) -> dict:
        if self.model is None:
            # Return mock prediction if no model
            prob = min(0.95, max(0.05, (temperature - 70) / 50))
            return {
                "defect_probability": float(prob),
                "predicted_defect": prob >= 0.5,
                "confidence": float(max(prob, 1 - prob))
            }

        input_df = pd.DataFrame([{
            "temperature": temperature,
            "line_speed": line_speed,
            "shift": shift,
            "operator_experience": operator_experience,
            "machine_age": machine_age
        }])

        proba = self.model.predict_proba(input_df)[0]
        defect_prob = proba[1] if len(proba) > 1 else proba[0]
        predicted = defect_prob >= 0.5
        confidence = max(proba)

        return {
            "defect_probability": float(defect_prob),
            "predicted_defect": bool(predicted),
            "confidence": float(confidence)
        }

    def get_feature_importance(self) -> dict:
        if not self.feature_importance:
            # Return mock importance if no model
            return {
                "temperature": 0.35,
                "line_speed": 0.25,
                "operator_experience": 0.15,
                "machine_age": 0.12,
                "shift_Day": 0.07,
                "shift_Night": 0.06
            }
        return self.feature_importance

    def train(self, data_path: str) -> dict:
        df = pd.read_csv(data_path)
        numeric_cols = ["temperature", "line_speed", "operator_experience", "machine_age"]
        df_clean = self._remove_outliers_iqr(df, numeric_cols)

        X = df_clean.drop(columns=["defect"])
        y = df_clean["defect"]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        rf = Pipeline([
            ("preprocess", self._make_preprocessor()),
            ("model", RandomForestClassifier(
                n_estimators=300, max_depth=12, min_samples_split=4,
                random_state=42, n_jobs=-1
            ))
        ])

        rf.fit(X_train, y_train)
        rf_proba = rf.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, rf_proba)
        report = classification_report(y_test, rf.predict(X_test))

        model_path = self.model_dir / "random_forest.pkl"
        joblib.dump(rf, model_path)
        self.model = rf
        self._extract_feature_importance()

        return {
            "model_path": str(model_path),
            "auc_score": float(auc),
            "classification_report": report
        }

    def get_temperature_curve_data(self) -> list:
        temps = np.linspace(60, 110, 20)
        results = []
        for temp in temps:
            pred = self.predict(
                temperature=float(temp),
                line_speed=85.0,
                shift="Day",
                operator_experience=5.0,
                machine_age=25.0
            )
            results.append({
                "temperature": float(temp),
                "defect_probability": pred["defect_probability"]
            })
        return results
