"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface RecentActivityCardProps {
  isLoading: boolean;
  data: any[];
}

export function RecentActivityCard({
  isLoading,
  data = [],
}: RecentActivityCardProps) {
  // Process the GPS data to create activity items
  const getActivityItems = () => {
    if (!data || data.length === 0) {
      return Array(2)
        .fill(null)
        .map((_, i) => ({
          id: i,
          title: "Vehicle activity",
          description: "Vehicle updated its location",
          time: "2 hours ago",
          avatar: String.fromCharCode(65 + i),
          color: `bg-emerald-${(i + 1) * 100}`,
        }));
    }

    return data.slice(0, 5).map((item, i) => {
      const time = new Date(item.timestamp);
      const now = new Date();
      const diffInHours = Math.round(
        (now.getTime() - time.getTime()) / (1000 * 60 * 60)
      );

      return {
        id: item.id || i,
        title: `Vehicle ${item.plateNumber} update`,
        description:
          item.speed > 5
            ? `Moving at ${item.speed.toFixed(1)} km/h`
            : "Stationary",
        time:
          diffInHours <= 24
            ? `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
            : format(time, "MMM d, yyyy"),
        avatar: item.plateNumber
          ? item.plateNumber.charAt(0)
          : String.fromCharCode(65 + i),
        color: `bg-emerald-${(i + 1) * 100}`,
      };
    });
  };

  const activities = getActivityItems();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 rounded-lg border p-3"
            >
              <Avatar className="mt-1 h-9 w-9">
                <AvatarFallback className={`${activity.color} text-white`}>
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface SystemAlertsCardProps {
  isLoading: boolean;
  emissions: any[];
  fuels: any[];
  gps: any[];
}

export function SystemAlertsCard({
  isLoading,
  emissions = [],
  fuels = [],
  gps = [],
}: SystemAlertsCardProps) {
  // Generate alerts based on the data
  const generateAlerts = () => {
    const alerts = [];

    // Check for high CO2 emissions
    const highEmissions = emissions.filter((e) => e.co2Percentage > 120);
    if (highEmissions.length > 0) {
      alerts.push({
        title: "Emissions Alert",
        desc: `Vehicle ${highEmissions[0].plateNumber} emissions above threshold`,
        severity: "high",
      });
    }

    // Check for low fuel
    const lowFuel = fuels.filter((f) => f.fuelLevel < 20);
    if (lowFuel.length > 0) {
      alerts.push({
        title: "Fuel Level Critical",
        desc: `Vehicle ${lowFuel[0].plateNumber} fuel level below 20%`,
        severity: "medium",
      });
    }

    // Check for offline vehicles
    const offlineVehicles = gps.filter((g) => !g.trackingStatus);
    if (offlineVehicles.length > 0) {
      alerts.push({
        title: "Device Offline",
        desc: `GPS Tracker for ${offlineVehicles[0].plateNumber} is offline`,
        severity: "high",
      });
    }

    // Check for high speed
    const highSpeed = gps.filter((g) => g.speed > 100);
    if (highSpeed.length > 0) {
      alerts.push({
        title: "Speed Alert",
        desc: `Vehicle ${highSpeed[0].plateNumber} exceeding speed limit`,
        severity: "medium",
      });
    }

    // Add a system update alert
    alerts.push({
      title: "System Update Required",
      desc: "New firmware available for tracking devices",
      severity: "low",
    });

    // If we don't have enough alerts, add a generic one
    if (alerts.length < 5) {
      alerts.push({
        title: "License Expiring",
        desc: "Vehicle tracking license expires in 7 days",
        severity: "medium",
      });
    }

    return alerts.slice(0, 5);
  };

  const alerts = generateAlerts();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <Skeleton className="h-2 w-2 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>System Alerts</CardTitle>
          <Badge
            variant="outline"
            className="bg-red-50 text-red-500 border-red-200"
          >
            {alerts.length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-lg border p-3"
            >
              <div
                className={`mt-1 h-2 w-2 rounded-full ${
                  alert.severity === "high"
                    ? "bg-red-500"
                    : alert.severity === "medium"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.desc}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      alert.severity === "high"
                        ? "bg-red-50 text-red-500 border-red-200"
                        : alert.severity === "medium"
                        ? "bg-amber-50 text-amber-500 border-amber-200"
                        : "bg-blue-50 text-blue-500 border-blue-200"
                    }`}
                  >
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    1 hour ago
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
