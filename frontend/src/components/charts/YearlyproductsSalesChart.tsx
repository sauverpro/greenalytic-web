"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Sample chart data
const chartData = [
  { month: "January", sedan: 1500, suv: 120, truck: 100 },
  { month: "February", sedan: 180, suv: 14, truck: 110 },
  { month: "March", sedan: 210, suv: 160, truck: 130 },
  { month: "April", sedan: 160, suv: 130, truck: 140 },
  { month: "May", sedan: 20, suv: 1800, truck: 150 },
  { month: "June", sedan: 2200, suv: 190, truck: 17 }
];

// Chart configuration
const chartConfig = {
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

export function YearlyproductsSalesChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          // Optional: format y-axis ticks
          tickFormatter={(value) => `${value}`}
        />
        <Legend />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="sedan"
          fill={chartConfig.sedan.color}
          radius={4}
          name={chartConfig.sedan.label}
        />
        <Bar
          dataKey="suv"
          fill={chartConfig.suv.color}
          radius={4}
          name={chartConfig.suv.label}
        />
        <Bar
          dataKey="truck"
          fill={chartConfig.truck.color}
          radius={4}
          name={chartConfig.truck.label}
        />
      </BarChart>
    </ChartContainer>
  );
}
