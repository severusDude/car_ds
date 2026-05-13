# Car Price Prediction Implementation

## Model Pipeline

Training follows `model/notebooks/Car_Price_Predict.ipynb`:

| Item        | Value                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------- |
| Source data | `model/data/raw/Car_sales.csv`                                                                                 |
| Target      | `Price_in_thousands`                                                                                           |
| Features    | `Engine_size`, `Horsepower`, `Wheelbase`, `Width`, `Length`, `Curb_weight`, `Fuel_capacity`, `Fuel_efficiency` |
| Cleaning    | Numeric missing values are filled with medians, then remaining missing rows are dropped                        |
| Estimator   | `LinearRegression` in a `Pipeline` with a median `SimpleImputer`                                               |
| Artifacts   | `model/models/car_price_linear.joblib` and `model/data/processed/car_sales_clean.csv`                          |

## API Contract

Start FastAPI from `model/` after training:

```bash
python train_model.py
uvicorn app:app --reload
```

Endpoints:

- `GET /health` returns service and artifact status
- `GET /features` returns required feature keys
- `POST /predict` accepts numeric car specs and returns predicted price

Request shape:

```json
{
  "Engine_size": 3.0,
  "Horsepower": 250,
  "Wheelbase": 105.0,
  "Width": 70.0,
  "Length": 180.0,
  "Curb_weight": 3.5,
  "Fuel_capacity": 18.0,
  "Fuel_efficiency": 22.0
}
```

Response shape:

```json
{
  "predicted_price_thousands": 31.234,
  "predicted_price_usd": 31234.0,
  "model": "linear_regression",
  "features": {}
}
```

## Next.js Integration

The browser posts to `/api/predict`. The Next.js route handler forwards the payload to FastAPI using:

```txt
FASTAPI_URL=http://127.0.0.1:8000
```

If `FASTAPI_URL` is not set, the route defaults to `http://127.0.0.1:8000`.
