from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from train_model import FEATURES, MODEL_PATH


app = FastAPI(title="Car Price Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


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


def _load_artifact() -> dict[str, Any]:
    model_path = Path(MODEL_PATH)
    if not model_path.exists():
        raise HTTPException(
            status_code=503,
            detail="Model artifact missing. Run `python train_model.py` from the model directory.",
        )

    return joblib.load(model_path)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "model_ready": Path(MODEL_PATH).exists(),
        "model_path": str(MODEL_PATH),
    }


@app.get("/features")
def features() -> dict[str, list[str]]:
    return {"features": FEATURES}


@app.post("/predict", response_model=PredictionResponse)
def predict(specs: CarSpecs) -> PredictionResponse:
    artifact = _load_artifact()
    payload = specs.model_dump()
    row = pd.DataFrame([{feature: payload[feature] for feature in FEATURES}])
    predicted_price = float(artifact["pipeline"].predict(row)[0])

    return PredictionResponse(
        predicted_price_thousands=round(predicted_price, 3),
        predicted_price_usd=round(predicted_price * 1000, 2),
        model="linear_regression",
        features=payload,
    )
