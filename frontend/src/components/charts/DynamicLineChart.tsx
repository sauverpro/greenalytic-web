"use client";

import { useEffect, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,

} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle
} from "@/components/ui/card";

// Define the structure for dataset keys
type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};


interface DataPoint {
  [key: string]: string | number; // Keys will be dynamic based on config
}

interface DynamicLineChartProps {
  data: DataPoint[]; // Replace `any[]` with `DataPoint[]`
  config: ChartConfig;
  xAxisKey: string;
  yAxisLabel: string;
  title: string;
  description?: string;
  height:string;
  width:string;
}

export function DynamicLineChart({
  data,
  config,
  xAxisKey,
  yAxisLabel,
  title,
  description,
  height,
  width
}: DynamicLineChartProps) {
  const [visibleKeys, setVisibleKeys] = useState<string[]>([]);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVisibleKeys(Object.keys(config)); // Show all series initially
    setMounted(true);
  }, [config]);

  if (!mounted) return null; // Prevent hydration errors

  // Toggle visibility of individual series


  // Show only one series
  // const toggleOnlyOne = (key: string) => {
  //   setVisibleKeys([key]);
  // };

  // Focus on one series using dropdown
  const handleFocusKey = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = event.target.value;
    if (selectedKey === "all") {
      setFocusKey(null);
      setVisibleKeys(Object.keys(config)); // Show all
    } else {
      setFocusKey(selectedKey);
      setVisibleKeys([selectedKey]); // Show only the selected one
    }
  };

  return (
    <Card className="mix-blend-normal h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="flex justify-between">
          {/* Focus Dropdown */}
          <div className="mb-2">
            <label className="text-sm font-medium mr-2">Focus on:</label>
            <select
              value={focusKey ?? "all"}
              onChange={handleFocusKey}
              className="p-2 border rounded-md">
              <option value="all">All</option>
              {Object.keys(config).map((key) => (
                <option key={key} value={key}>
                  {config[key].label}
                </option>
              ))}
            </select>
          </div>
          {/* Toggle Buttons */}
          {/* <div className="flex flex-wrap gap-2 mb-2">
            {Object.keys(config).map((key) => (
              <button
                key={key}
                disabled={focusKey !== null}
                className={`px-3 py-1 text-sm rounded ${
                  visibleKeys.includes(key)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleKey(key)}>
                {config[key].label}
              </button>
            ))}
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded"
              onClick={() => setVisibleKeys([])}>
              Hide All
            </button>
          </div> */}
        </div>

        {/* Line Chart */}
        <div style={{ height, width }}>
          {" "}
          {/* Adjust height dynamically */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="1 1" />
              <XAxis
                dataKey={xAxisKey}
                label={{
                  value: xAxisKey,
                  position: "insideBottom",
                  offset: -8
                }}
              />
              <YAxis
                label={{
                  value: yAxisLabel,
                  angle: -90,
                  position: "insideLeft"
                }}
                domain={[0, "auto"]}
              />
              <Tooltip />

              <Legend wrapperStyle={{ padding: 10 }} />

              {Object.keys(config).map(
                (key) =>
                  visibleKeys.includes(key) && (
                    <Line
                      key={key}
                      type="linear"
                      dataKey={key}
                      stroke={config[key].color}
                      strokeWidth={2}
                      dot={{ fill: config[key].color }}
                    />
                  )
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* <CardFooter className="text-sm text-muted-foreground">
        Select a category from the dropdown to focus, or toggle multiple using
        buttons.
      </CardFooter> */}
    </Card>
  );
}
