"use client";

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Define props for the dynamic daily sales chart
interface DynamicDailySalesChartProps {
  data: Array<{ day: string } & Record<string, number>>; // Record for dynamic product names
}

export function DynamicDailySalesChart({ data }: DynamicDailySalesChartProps) {
  // Extract product names dynamically from the first entry (assuming all entries have the same products)
  const productNames = Object.keys(data[0]).filter((key) => key !== "day");

  // Define your chart config here
  const chartConfig = {
    tooltip: {
      // You can define tooltip customization here
    },
    legend: {
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      label: undefined,
      icon: undefined,
      color: undefined,
      theme: undefined
    }
  };

  return (
    <ChartContainer
      className="min-h-[8rem] w-full bg-slate-200 pt-8 z-0"
      config={chartConfig}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} tickMargin={5} axisLine={false} />
        <YAxis tickLine={false} tickMargin={5} axisLine={true} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />

        {/* Dynamically render bars for each product */}
        {productNames.map((product, index) => (
          <Bar
            key={product}
            dataKey={product}
            fill={`hsl(${(index * 60) % 360}, 100%, 50%)`} // Assign dynamic colors
            radius={4}
            name={product}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
