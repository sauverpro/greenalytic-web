"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CarFront,
  AlertTriangle,
  Wrench,
  Radio,
  GaugeCircle
} from "lucide-react";
import vehicleService from "../services";


interface VehicleStats {
  total: number;
  normalEmission: number;
  topPolluting: number;
  inactive: number;
  maintenance: number;
}

export function VehicleStats() {
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    normalEmission: 0,
    topPolluting: 0,
    inactive: 0,
    maintenance: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const results = await Promise.allSettled([
          vehicleService.countVehicles(), // total
          vehicleService.countVehiclesByStatus("NORMAL_EMISSION"),
          vehicleService.countVehiclesByStatus("TOP_POLLUTING"),
          vehicleService.countVehiclesByStatus("INACTIVE_DISCONNECTED"),
          vehicleService.countVehiclesByStatus("UNDER_MAINTENANCE")
        ]);

        const [
          totalResult,
          normalResult,
          topResult,
          inactiveResult,
          maintenanceResult
        ] = results;

        const total =
          totalResult.status === "fulfilled" ? totalResult.value : 0;
        const normal =
          normalResult.status === "fulfilled" ? normalResult.value : 0;
        const top = topResult.status === "fulfilled" ? topResult.value : 0;
        const inactive =
          inactiveResult.status === "fulfilled" ? inactiveResult.value : 0;
        const maintenance =
          maintenanceResult.status === "fulfilled"
            ? maintenanceResult.value
            : 0;

        setStats({
          total,
          normalEmission: normal,
          topPolluting: top,
          inactive,
          maintenance
        });
      } catch (err) {
        console.error("🔥 Error loading vehicle stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: CarFront,
      description: "All registered vehicles",
      color: "text-blue-600"
    },
    {
      title: "Normal Emission",
      value: stats.normalEmission,
      icon: GaugeCircle,
      description: "Healthy emission levels",
      color: "text-green-600"
    },
    {
      title: "Top Polluting",
      value: stats.topPolluting,
      icon: AlertTriangle,
      description: "Needs urgent inspection",
      color: "text-red-600"
    },
    {
      title: "Under Maintenance",
      value: stats.maintenance,
      icon: Wrench,
      description: "Currently being serviced",
      color: "text-yellow-600"
    },
    {
      title: "Disconnected / Inactive",
      value: stats.inactive,
      icon: Radio,
      description: "No recent connection",
      color: "text-gray-500"
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) =>
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mb-1" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
