"use client";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

// Define the props for the dynamic bar chart
interface DynamicBarChartProps<T extends string> {
  data: Array<{ month: string } & Record<T, number>>; // Allows "month" + dynamic keys
  config: Record<T, { label: string; color: string }>; // Config with labels and colors
  xAxisKey: string; // The key for X-axis (e.g., "month")
}

export function  DynamicBarChart<T extends string>({
  data,
  config,
  xAxisKey
}: DynamicBarChartProps<T>) {
  return (
    <ChartContainer
      config={config}
      className="min-h-[8rem] w-full bg-slate-200 pt-8 z-0">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)} // Shorten month names
        />
        <YAxis tickLine={false} tickMargin={5} axisLine={true} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />

        {/* Dynamically render bars based on config */}
        {Object.keys(config).map((key) => (
          <Bar
            key={key}
            dataKey={key}
            fill={config[key as T].color}
            radius={4}
            name={config[key as T].label}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}
