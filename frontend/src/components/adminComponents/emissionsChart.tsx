"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface EmissionsChartProps {
  isLoading: boolean;
  data: any;
}

export default function EmissionsChart({
  isLoading,
  data,
}: EmissionsChartProps) {
  // Process data for the chart
  const processChartData = () => {
    if (!data || !data.co2) {
      return [
        { name: "Normal", value: 65, color: "#10b981" },
        { name: "Warning", value: 25, color: "#f59e0b" },
        { name: "Critical", value: 10, color: "#ef4444" },
      ];
    }

    // Calculate thresholds based on your business logic
    const normalThreshold = 100; // Example: CO2 below 100 is normal
    const warningThreshold = 120; // Example: CO2 between 100-120 is warning

    // Calculate percentages based on anomalies and thresholds
    const criticalPercentage = (data.anomalies / 100) * 100;
    const warningPercentage =
      ((data.co2.average > normalThreshold ? 1 : 0) -
        criticalPercentage / 100) *
      100;
    const normalPercentage = 100 - criticalPercentage - warningPercentage;

    return [
      {
        name: "Normal",
        value: Math.max(0, normalPercentage),
        color: "#10b981",
      },
      {
        name: "Warning",
        value: Math.max(0, warningPercentage),
        color: "#f59e0b",
      },
      {
        name: "Critical",
        value: Math.max(0, criticalPercentage),
        color: "#ef4444",
      },
    ];
  };

  const chartData = processChartData();
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Emission Summary</CardTitle>
        <CardDescription>Vehicle emission status distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Percentage",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ paddingLeft: "10px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
