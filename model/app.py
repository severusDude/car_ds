from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from .train_model import FEATURES, MODEL_PATH
except ImportError:  # Allows `uvicorn app:app` from the model directory.
    from train_model import FEATURES, MODEL_PATH


MODEL_NAME = "linear_regression"
MODEL_VERSION = "1.0.0"

app = FastAPI(title="Car Price Prediction API", version=MODEL_VERSION)


class CarSpecs(BaseModel):
    Engine_size: float = Field(gt=0)
    Horsepower: float = Field(gt=0)
    Wheelbase: float = Field(gt=0)
    Width: float = Field(gt=0)
    Length: float = Field(gt=0)
    Curb_weight: float = Field(gt=0)
    Fuel_capacity: float = Field(gt=0)
    Fuel_efficiency: float = Field(gt=0)


class PredictionResponse(BaseModel):
    predicted_price_thousands: float
    predicted_price_usd: float
    model: str
    features: dict[str, float]


@lru_cache(maxsize=1)
def _load_artifact() -> dict[str, Any]:
    model_path = Path(MODEL_PATH)
    if not model_path.exists():
        raise HTTPException(
            status_code=503,
            detail="Model artifact missing. Run `python train_model.py` from the model directory.",
        )

    artifact = joblib.load(model_path)
    if "pipeline" not in artifact:
        raise HTTPException(status_code=503, detail="Model artifact is invalid.")

    return artifact


def _readiness() -> dict[str, Any]:
    try:
        artifact = _load_artifact()
    except HTTPException as exc:
        return {
            "model_loaded": False,
            "error": exc.detail,
            "artifact_path": str(MODEL_PATH),
        }

    artifact_features = artifact.get("features", FEATURES)
    metrics = artifact.get("metrics", {})

    return {
        "model_loaded": True,
        "model": MODEL_NAME,
        "model_version": MODEL_VERSION,
        "feature_count": len(artifact_features),
        "artifact_path": str(MODEL_PATH),
        "metrics": metrics,
    }


@app.get("/health")
@app.get("/backend/health", include_in_schema=False)
def health() -> dict[str, Any]:
    readiness = _readiness()
    return {
        "status": "ok" if readiness["model_loaded"] else "degraded",
        "service": "car-price-prediction-api",
        **readiness,
    }


@app.get("/features")
@app.get("/backend/features", include_in_schema=False)
def features() -> dict[str, list[str]]:
    return {"features": FEATURES}


@app.post("/predict", response_model=PredictionResponse)
@app.post("/backend/predict", response_model=PredictionResponse, include_in_schema=False)
def predict(specs: CarSpecs) -> PredictionResponse:
    artifact = _load_artifact()
    payload = specs.model_dump()
    row = pd.DataFrame([{feature: payload[feature] for feature in FEATURES}])
    predicted_price = float(artifact["pipeline"].predict(row)[0])

    return PredictionResponse(
        predicted_price_thousands=round(predicted_price, 3),
        predicted_price_usd=round(predicted_price * 1000, 2),
        model=MODEL_NAME,
        features=payload,
    )
