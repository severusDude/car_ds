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
BACKEND_URL=https://<deployment>.vercel.app/backend
FASTAPI_URL=http://127.0.0.1:8000
```

On Vercel Services, `BACKEND_URL` is generated automatically for the `backend` service. For standalone local development, `FASTAPI_URL` can point at a local FastAPI server. If neither is set, the route defaults to `http://127.0.0.1:8000`.

## Production Deployment

- `vercel.json` defines two Vercel Services: Next.js at `/` and FastAPI at `/backend`.
- FastAPI loads `model/models/car_price_linear.joblib` once per process with an in-memory cache.
- `GET /health` reports readiness details: model load status, model version, feature count, artifact path, and training metrics.
- Runtime Python dependencies are limited to FastAPI, model serving, and scikit-learn packages; notebook/Jupyter packages live in the dev dependency group.
- Full deployment steps are documented in `docs/DEPLOYMENT.md`.

## Frontend Contract and View

- Shared zod contracts live in `lib/car-price-contract.ts`.
- The `/api/predict` route validates request and response payloads before returning JSON.
- The prediction form uses `react-hook-form`, `zodResolver`, shadcn `Field`, and shadcn `InputGroup`.
- The page layout follows `docs/screen.png`: predictor nav, left form card, right estimate card, author panel, car visual band, and footer.
- The car visual is a local asset at `public/car-hero.png`.
