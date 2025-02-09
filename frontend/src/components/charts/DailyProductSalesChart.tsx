"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Daily chart data
const dailyChartData = [
  { day: "Monday", sedan: 35, suv: 28, truck: 22 },
  { day: "Tuesday", sedan: 42, suv: 32, truck: 25 },
  { day: "Wednesday", sedan: 48, suv: 38, truck: 30 },
  { day: "Thursday", sedan: 45, suv: 35, truck: 28 },
  { day: "Friday", sedan: 50, suv: 340, truck: 32 },
  { day: "Saturday", sedan: 38, suv: 30, truck: 24 },
  { day: "Sunday", sedan: 30, suv: 25, truck: 20 }
];

// Using the same chart configuration for consistency
const dailyChartConfig = {
  sedan: {
    label: "Sedan",
    color: "#2563eb"
  },
  suv: {
    label: "SUV",
    color: "#60a5fa"
  },
  truck: {
    label: "Truck",
    color: "#4ade80"
  }
} satisfies ChartConfig;

export function DailyProductSalesChart() {
  return (
    <ChartContainer config={dailyChartConfig} className="max-h-[400px] w-full">
      <BarChart data={dailyChartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} // Shows "Mon", "Tue", etc.
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => `${value}`}
        />
        <Legend />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="sedan"
          fill={dailyChartConfig.sedan.color}
          radius={4}
          name={dailyChartConfig.sedan.label}
        />
        <Bar
          dataKey="suv"
          fill={dailyChartConfig.suv.color}
          radius={4}
          name={dailyChartConfig.suv.label}
        />
        <Bar
          dataKey="truck"
          fill={dailyChartConfig.truck.color}
          radius={4}
          name={dailyChartConfig.truck.label}
        />
      </BarChart>
    </ChartContainer>
  );
}
