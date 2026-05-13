from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "raw" / "Car_sales.csv"
PROCESSED_PATH = BASE_DIR / "data" / "processed" / "car_sales_clean.csv"
MODEL_PATH = BASE_DIR / "models" / "car_price_linear.joblib"

FEATURES = [
    "Engine_size",
    "Horsepower",
    "Wheelbase",
    "Width",
    "Length",
    "Curb_weight",
    "Fuel_capacity",
    "Fuel_efficiency",
]
TARGET = "Price_in_thousands"


def load_and_clean_data(data_path: Path = DATA_PATH) -> pd.DataFrame:
    df = pd.read_csv(data_path)

    numeric_columns = df.select_dtypes(include=[np.number]).columns
    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].median())

    df = df.dropna().reset_index(drop=True)
    return df


def train_model() -> dict[str, float]:
    df = load_and_clean_data()

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    pipeline = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("model", LinearRegression()),
        ]
    )
    pipeline.fit(X_train, y_train)

    predictions = pipeline.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, predictions)))
    r2 = float(r2_score(y_test, predictions))

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROCESSED_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(
        {
            "pipeline": pipeline,
            "features": FEATURES,
            "target": TARGET,
            "metrics": {"rmse": rmse, "r2": r2},
        },
        MODEL_PATH,
    )
    df.to_csv(PROCESSED_PATH, index=False)

    return {"rmse": rmse, "r2": r2, "rows": float(len(df))}


if __name__ == "__main__":
    metrics = train_model()
    print(f"Model saved to {MODEL_PATH}")
    print(f"Clean data saved to {PROCESSED_PATH}")
    print(f"RMSE: {metrics['rmse']:.4f}")
    print(f"R2: {metrics['r2']:.4f}")
