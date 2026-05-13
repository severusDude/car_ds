"use client";

import { FormEvent, useMemo, useState } from "react";
import { Calculator, Loader2, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

type FeatureKey =
  | "Engine_size"
  | "Horsepower"
  | "Wheelbase"
  | "Width"
  | "Length"
  | "Curb_weight"
  | "Fuel_capacity"
  | "Fuel_efficiency";

type PredictionResponse = {
  predicted_price_thousands: number;
  predicted_price_usd: number;
  model: string;
};

const fields: Array<{
  key: FeatureKey;
  label: string;
  suffix: string;
  step: string;
}> = [
  { key: "Engine_size", label: "Engine size", suffix: "L", step: "0.1" },
  { key: "Horsepower", label: "Horsepower", suffix: "hp", step: "1" },
  { key: "Wheelbase", label: "Wheelbase", suffix: "in", step: "0.1" },
  { key: "Width", label: "Width", suffix: "in", step: "0.1" },
  { key: "Length", label: "Length", suffix: "in", step: "0.1" },
  { key: "Curb_weight", label: "Curb weight", suffix: "k lb", step: "0.001" },
  { key: "Fuel_capacity", label: "Fuel capacity", suffix: "gal", step: "0.1" },
  { key: "Fuel_efficiency", label: "Fuel efficiency", suffix: "mpg", step: "1" },
];

const sampleValues: Record<FeatureKey, string> = {
  Engine_size: "3.0",
  Horsepower: "250",
  Wheelbase: "105.0",
  Width: "70.0",
  Length: "180.0",
  Curb_weight: "3.5",
  Fuel_capacity: "18.0",
  Fuel_efficiency: "22",
};

export function CarPriceForm() {
  const [values, setValues] = useState(sampleValues);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const payload = useMemo(() => {
    return fields.reduce(
      (next, field) => ({
        ...next,
        [field.key]: Number(values[field.key]),
      }),
      {} as Record<FeatureKey, number>
    );
  }, [values]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPrediction(null);

    const invalidField = fields.find((field) => !Number.isFinite(payload[field.key]) || payload[field.key] <= 0);
    if (invalidField) {
      setError(`${invalidField.label} must be a number greater than zero.`);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Prediction failed.");
      }

      setPrediction(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <p className="text-sm font-medium text-primary">Car Price Prediction</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal sm:text-3xl">
              Estimate vehicle price from core specs.
            </h1>
          </div>
          <ThemeSwitcher />
        </header>

        <section className="grid flex-1 gap-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label key={field.key} className="grid gap-2">
                  <span className="text-sm font-medium">{field.label}</span>
                  <span className="flex h-11 items-center rounded-md border border-input bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <input
                      className="h-full min-w-0 flex-1 rounded-md bg-transparent px-3 text-sm outline-none"
                      type="number"
                      min="0"
                      step={field.step}
                      value={values[field.key]}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                    <span className="w-14 border-l border-border px-2 text-center text-xs font-medium text-muted-foreground">
                      {field.suffix}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {error && (
              <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" className="rounded-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : <Calculator />}
                Predict Price
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-md"
                onClick={() => {
                  setValues(sampleValues);
                  setPrediction(null);
                  setError(null);
                }}
              >
                <RotateCcw />
                Reset
              </Button>
            </div>
          </form>

          <aside className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-muted-foreground">Predicted value</p>
            <div className="mt-4 min-h-32">
              {prediction ? (
                <>
                  <p className="text-4xl font-semibold tracking-normal">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    }).format(prediction.predicted_price_usd)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {prediction.predicted_price_thousands.toFixed(3)} thousand USD using {prediction.model}.
                  </p>
                </>
              ) : (
                <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                  Enter specs and run prediction. Defaults match notebook sample input.
                </p>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
