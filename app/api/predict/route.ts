import {
  carPriceInputSchema,
  predictionResponseSchema,
} from "@/lib/car-price-contract";

export const runtime = "nodejs";

const FASTAPI_URL = process.env.FASTAPI_URL ?? "http://127.0.0.1:8000";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ detail: "Invalid JSON payload." }, { status: 400 });
  }

  const parsedPayload = carPriceInputSchema.safeParse(payload);

  if (!parsedPayload.success) {
    return Response.json(
      {
        detail: "Invalid car specification payload.",
        errors: parsedPayload.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${FASTAPI_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsedPayload.data),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({
      detail: "FastAPI returned a non-JSON response.",
    }));

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    const parsedResponse = predictionResponseSchema.safeParse(data);

    if (!parsedResponse.success) {
      return Response.json(
        {
          detail: "Prediction service returned an invalid response.",
          errors: parsedResponse.error.flatten().fieldErrors,
        },
        { status: 502 }
      );
    }

    return Response.json(parsedResponse.data, { status: response.status });
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
