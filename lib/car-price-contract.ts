import { z } from "zod/v4";

export const carPriceInputSchema = z.object({
  Engine_size: z.number().positive("Engine size must be greater than 0."),
  Horsepower: z.number().positive("Horsepower must be greater than 0."),
  Wheelbase: z.number().positive("Wheelbase must be greater than 0."),
  Width: z.number().positive("Width must be greater than 0."),
  Length: z.number().positive("Length must be greater than 0."),
  Curb_weight: z.number().positive("Curb weight must be greater than 0."),
  Fuel_capacity: z.number().positive("Fuel capacity must be greater than 0."),
  Fuel_efficiency: z.number().positive("Fuel efficiency must be greater than 0."),
});

export const predictionResponseSchema = z.object({
  predicted_price_thousands: z.number(),
  predicted_price_usd: z.number(),
  model: z.string(),
  features: z.record(z.string(), z.number()),
});

export type CarPriceInput = z.infer<typeof carPriceInputSchema>;
export type PredictionResponse = z.infer<typeof predictionResponseSchema>;
export type CarPriceFieldKey = keyof CarPriceInput;

export const carPriceDefaultValues: CarPriceInput = {
  Engine_size: 3,
  Horsepower: 250,
  Wheelbase: 105,
  Width: 70,
  Length: 180,
  Curb_weight: 3.5,
  Fuel_capacity: 18,
  Fuel_efficiency: 22,
};

export const carPriceFields: Array<{
  key: CarPriceFieldKey;
  label: string;
  unit: string;
  icon: string;
  step: string;
  placeholder: string;
}> = [
  {
    key: "Engine_size",
    label: "Engine size",
    unit: "L",
    icon: "gauge",
    step: "0.1",
    placeholder: "Enter engine size...",
  },
  {
    key: "Horsepower",
    label: "Horsepower",
    unit: "hp",
    icon: "zap",
    step: "1",
    placeholder: "Enter horsepower...",
  },
  {
    key: "Wheelbase",
    label: "Wheelbase",
    unit: "in",
    icon: "ruler",
    step: "0.1",
    placeholder: "Enter wheelbase...",
  },
  {
    key: "Width",
    label: "Width",
    unit: "in",
    icon: "move-horizontal",
    step: "0.1",
    placeholder: "Enter width...",
  },
  {
    key: "Length",
    label: "Length",
    unit: "in",
    icon: "move-diagonal",
    step: "0.1",
    placeholder: "Enter length...",
  },
  {
    key: "Curb_weight",
    label: "Curb weight",
    unit: "k lb",
    icon: "scale",
    step: "0.001",
    placeholder: "Enter curb weight...",
  },
  {
    key: "Fuel_capacity",
    label: "Fuel capacity",
    unit: "gal",
    icon: "fuel",
    step: "0.1",
    placeholder: "Enter fuel capacity...",
  },
  {
    key: "Fuel_efficiency",
    label: "Fuel efficiency",
    unit: "mpg",
    icon: "leaf",
    step: "1",
    placeholder: "Enter fuel efficiency...",
  },
];
