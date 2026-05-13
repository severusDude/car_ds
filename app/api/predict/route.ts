export const runtime = "nodejs";

const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "Invalid JSON payload." }, { status: 400 });
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      detail: "FastAPI returned a non-JSON response.",
    }));

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        detail:
          "Prediction service is unavailable. Start FastAPI on http://127.0.0.1:8000.",
      },
      { status: 503 }
    );
  }
}
