# Vercel Services Deployment

This project deploys as one Vercel project with two Services:

- Next.js frontend at `/`
- FastAPI prediction backend at `/backend`

Vercel Services is currently Public Beta. In the Vercel dashboard, set the project framework to `Services` and keep `vercel.json` committed.

## Architecture

```mermaid
flowchart LR
  Browser["Browser"] --> Next["Next.js service /"]
  Next --> Route["Route handler /api/predict"]
  Route --> FastAPI["FastAPI service /backend"]
  FastAPI --> Model["model/models/car_price_linear.joblib"]
```

The browser only calls `/api/predict`. The Next.js route validates the payload and forwards it to the FastAPI service. On Vercel, `BACKEND_URL` is generated automatically for the backend service. Local fallback is `FASTAPI_URL`, then `http://127.0.0.1:8000`.

## Runtime

Frontend:

```bash
pnpm install
pnpm build
pnpm start
```

Backend:

```bash
cd model
uv sync --group dev
uv run python train_model.py
uv run --group dev uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

Production backend dependencies are kept in `model/pyproject.toml` under `[project].dependencies`. Notebook, Jupyter MCP, `uvicorn`, and smoke-test tools live in the `dev` dependency group so they are not needed by the deployed serverless backend.

## Local Vercel

Run both Services through Vercel routing:

```bash
vercel dev -L
```

Check:

```bash
curl http://127.0.0.1:3000/backend/health
curl http://127.0.0.1:3000/api/predict
```

For standalone local development without Vercel, run FastAPI on port `8000` and Next.js on port `3000`. Set `FASTAPI_URL` only if the backend runs somewhere else.

## Deploy

```bash
vercel deploy
vercel deploy --prod
```

After deploy, verify:

- `GET /` renders the prediction UI
- `GET /backend/health` returns `status: ok` and `model_loaded: true`
- `GET /backend/features` returns the eight model features
- `POST /api/predict` returns `predicted_price_usd`

## Bundle Notes

The backend bundle intentionally includes only:

- `model/app.py`
- `model/train_model.py`
- `model/models/car_price_linear.joblib`
- Python dependency metadata

It excludes notebooks, raw/processed data, local virtualenvs, docs, caches, and frontend dependencies. The model artifact is committed and loaded at module level with process cache, so deployment does not train the model.

## References

- [Vercel Services](https://vercel.com/docs/services)
- [Services routing and communication](https://vercel.com/docs/services/routing)
- [Python runtime](https://vercel.com/docs/functions/runtimes/python)
- [FastAPI on Vercel](https://vercel.com/docs/frameworks/backend/fastapi)
- [Production checklist](https://vercel.com/docs/production-checklist)
