from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uvicorn
from ml_service import MLService

app = FastAPI(title="AI Production ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ml_service = MLService()


class PredictionInput(BaseModel):
    temperature: float
    line_speed: float
    shift: str
    operator_experience: float
    machine_age: float


class PredictionOutput(BaseModel):
    defect_probability: float
    predicted_defect: bool
    confidence: float


class FeatureImportance(BaseModel):
    feature: str
    importance: float


class TemperatureCurvePoint(BaseModel):
    temperature: float
    defect_probability: float


@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": ml_service.is_loaded()}


@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    try:
        result = ml_service.predict(
            temperature=input_data.temperature,
            line_speed=input_data.line_speed,
            shift=input_data.shift,
            operator_experience=input_data.operator_experience,
            machine_age=input_data.machine_age
        )
        return PredictionOutput(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict/batch", response_model=List[PredictionOutput])
def batch_predict(inputs: List[PredictionInput]):
    results = []
    for inp in inputs:
        result = ml_service.predict(
            temperature=inp.temperature,
            line_speed=inp.line_speed,
            shift=inp.shift,
            operator_experience=inp.operator_experience,
            machine_age=inp.machine_age
        )
        results.append(PredictionOutput(**result))
    return results


@app.get("/feature-importance", response_model=List[FeatureImportance])
def get_feature_importance():
    importance = ml_service.get_feature_importance()
    return [FeatureImportance(feature=f, importance=i) for f, i in importance.items()]


@app.get("/temperature-curve", response_model=List[TemperatureCurvePoint])
def get_temperature_curve():
    data = ml_service.get_temperature_curve_data()
    return [TemperatureCurvePoint(**point) for point in data]


@app.post("/train")
def train_model(data_path: str = "../ai-process-optimization/data/production_data.csv"):
    try:
        result = ml_service.train(data_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
