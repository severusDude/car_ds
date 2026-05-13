"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Car,
  Fuel,
  Gauge,
  Leaf,
  Loader2,
  MoveDiagonal,
  MoveHorizontal,
  Ruler,
  Scale,
  Zap,
} from "lucide-react";
import { Controller, type Resolver, useForm, useWatch } from "react-hook-form";

import {
  carPriceDefaultValues,
  carPriceFields,
  carPriceInputSchema,
  type CarPriceFieldKey,
  type CarPriceInput,
  type PredictionResponse,
  predictionResponseSchema,
} from "@/lib/car-price-contract";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ThemeSwitcher } from "@/components/theme-switcher";

const iconMap = {
  gauge: Gauge,
  zap: Zap,
  ruler: Ruler,
  "move-horizontal": MoveHorizontal,
  "move-diagonal": MoveDiagonal,
  scale: Scale,
  fuel: Fuel,
  leaf: Leaf,
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function fieldValue(
  values: Partial<Record<CarPriceFieldKey, number>>,
  key: CarPriceFieldKey,
) {
  const value = values[key];
  return Number.isFinite(value) ? String(value) : "xxx";
}

export function CarPriceForm() {
  const form = useForm<CarPriceInput>({
    resolver: zodResolver(
      carPriceInputSchema as never,
    ) as Resolver<CarPriceInput>,
    defaultValues: carPriceDefaultValues,
    mode: "onSubmit",
  });
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [submittedValues, setSubmittedValues] = useState<CarPriceInput>(
    carPriceDefaultValues,
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const watchedValues = useWatch({ control: form.control });
  const isSubmitting = form.formState.isSubmitting;
  const summaryValues = prediction ? submittedValues : watchedValues;
  const price = prediction
    ? formatCurrency(prediction.predicted_price_usd)
    : "$20.000";

  async function onSubmit(values: CarPriceInput) {
    setApiError(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail ?? "Prediction failed.");
      }

      const parsedPrediction = predictionResponseSchema.parse(data);
      setPrediction(parsedPrediction);
      setSubmittedValues(values);
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Prediction failed.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf8ff] text-[#20110b] dark:bg-zinc-950 dark:text-zinc-50">
      <header className="border-b border-[#e7b8a3] bg-[#fbf8ff]/95 dark:border-zinc-800 dark:bg-zinc-950/95">
        <div className="mx-auto flex h-20 max-w-[1540px] items-center justify-between px-7">
          <h1 className="text-3xl font-bold tracking-normal text-[#9b3a00]">
            Car Prediction
          </h1>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1540px] gap-7 px-7 py-10 lg:grid-cols-[0.82fr_1.18fr]">
        <section className="rounded-lg border border-[#e3ac96] bg-white px-10 py-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
            Prediksi Harga Mobil
          </h2>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-9">
            <FieldGroup className="gap-5">
              {carPriceFields.map((field) => {
                const Icon = iconMap[field.icon as keyof typeof iconMap];
                const error = form.formState.errors[field.key];

                return (
                  <Controller
                    key={field.key}
                    control={form.control}
                    name={field.key}
                    render={({ field: controllerField }) => (
                      <Field data-invalid={!!error} className="gap-2">
                        <FieldLabel
                          htmlFor={field.key}
                          className="text-sm font-medium uppercase text-[#3a1a0d] dark:text-zinc-200"
                        >
                          {field.label}
                        </FieldLabel>
                        <InputGroup className="h-14 rounded-md border border-[#ded7e4] bg-[#fbf8ff] dark:border-zinc-700 dark:bg-zinc-950">
                          <InputGroupAddon>
                            <Icon className="size-4" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id={field.key}
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step={field.step}
                            placeholder={field.placeholder}
                            aria-invalid={!!error}
                            value={
                              Number.isFinite(controllerField.value)
                                ? controllerField.value
                                : ""
                            }
                            onChange={(event) =>
                              controllerField.onChange(
                                Number(event.target.value),
                              )
                            }
                            onBlur={controllerField.onBlur}
                            name={controllerField.name}
                            ref={controllerField.ref}
                            className="text-base"
                          />
                          <InputGroupAddon align="inline-end">
                            {field.unit}
                          </InputGroupAddon>
                        </InputGroup>
                        <FieldError errors={error ? [error] : []} />
                      </Field>
                    )}
                  />
                );
              })}
            </FieldGroup>

            {apiError && (
              <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {apiError}
              </p>
            )}

            <div className="flex items-center w-full gap-2">
              <Button
                type="button"
                onClick={() => form.reset()}
                variant="outline"
                size="lg"
                className="mt-10 rounded-md bg-[#ff6500] text-base font-semibold text-white shadow-md hover:bg-[#e85d00]"
              >
                Reset
              </Button>

              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="mt-10 rounded-md bg-[#ff6500] text-base font-semibold text-white shadow-md hover:bg-[#e85d00]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Car />}
                Hitung Harga Mobil
              </Button>
            </div>
          </form>
        </section>

        <section className="space-y-8">
          <div className="rounded-lg border border-[#e3ac96] bg-white px-10 py-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
              Perkiraan Harga Mobil
            </h2>

            <div
              className={cn(
                "mt-11 flex min-h-44 items-center justify-center rounded-lg border border-[#ff8b61] bg-[#fff1ec] text-5xl font-bold tracking-normal text-[#5a1d05] dark:bg-[#2b1209] dark:text-orange-100",
                isSubmitting && "animate-pulse",
              )}
            >
              {price}
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {carPriceFields.slice(0, 4).map((field) => (
                <div
                  key={field.key}
                  className="rounded-md border border-[#e5dfec] bg-[#f3f0fb] px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <p className="text-sm font-medium uppercase tracking-normal text-zinc-600 dark:text-zinc-400">
                    {field.label}
                  </p>
                  <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                    {fieldValue(summaryValues, field.key)} {field.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#91bdff] bg-[#e4f0ff] px-10 py-9 text-[#101827] dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-50">
            <p className="mb-6 text-base font-medium uppercase">
              Sistem ini dibuat oleh:
            </p>
            <dl className="grid max-w-md grid-cols-[90px_1fr] gap-y-3 text-base">
              <dt>NAMA</dt>
              <dd>: Lutfi Fajar Salladin</dd>
              <dt>NPM</dt>
              <dd>: 237006095</dd>
            </dl>
          </div>
        </section>
      </div>

      <footer className="border-t border-[#e7b8a3] bg-white px-7 py-10 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-[1540px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-950 dark:text-zinc-50">
              AutoPredict AI
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              © 2024 AutoPredict AI. All rights reserved.
            </p>
          </div>
          <nav className="flex flex-wrap gap-8 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Documentation</span>
          </nav>
        </div>
      </footer>
    </main>
  );
}
