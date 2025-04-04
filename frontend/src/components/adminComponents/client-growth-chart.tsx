"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientGrowthChartProps {
  isLoading: boolean;
  data: any[];
}

export default function ClientGrowthChart({
  isLoading,
  data,
}: ClientGrowthChartProps) {
  // Process data for the chart
  const processChartData = () => {
    if (!data || data.length === 0) {
      // Return sample data if no data is available
      return [
        { month: "Jan", clients: 20, speed: 40 },
        { month: "Feb", clients: 28, speed: 45 },
        { month: "Mar", clients: 35, speed: 50 },
        { month: "Apr", clients: 42, speed: 55 },
        { month: "May", clients: 50, speed: 60 },
        { month: "Jun", clients: 65, speed: 65 },
        { month: "Jul", clients: 78, speed: 70 },
        { month: "Aug", clients: 90, speed: 75 },
        { month: "Sep", clients: 102, speed: 80 },
        { month: "Oct", clients: 115, speed: 85 },
        { month: "Nov", clients: 123, speed: 90 },
        { month: "Dec", clients: 128, speed: 95 },
      ];
    }

    const groupedData = data.reduce((acc: any, item: any) => {
      const date = new Date(item.timestamp);
      const month = date.toLocaleString("default", { month: "short" });

      if (!acc[month]) {
        acc[month] = { count: 0, speedSum: 0 };
      }

      acc[month].count += 1;
      acc[month].speedSum += item.speed || 0;

      return acc;
    }, {});

    return Object.keys(groupedData).map((month) => ({
      month,
      clients: groupedData[month].count,
      speed: groupedData[month].speedSum / groupedData[month].count,
    }));
  };

  const chartData = processChartData();

  if (isLoading) {
    return (
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Vehicle Activity</CardTitle>
          <CardDescription>Speed and activity over time</CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuItem>Set Alert</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="clients"
                name="Activity Count"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="speed"
                name="Avg Speed (km/h)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
