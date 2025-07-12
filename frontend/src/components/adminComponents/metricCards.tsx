import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Fuel, Gauge } from "lucide-react";

interface MetricDataCardProps {
  title: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "critical";
  icon: React.ReactNode;
}

export function MetricDataCard({
  title,
  value,
  unit,
  status = "normal",
  icon,
}: MetricDataCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "critical":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "normal":
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-emerald-50 p-2 flex-shrink-0">
            {icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground truncate">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold truncate">{value}</p>
              {unit && (
                <span className="text-xs text-muted-foreground">{unit}</span>
              )}
            </div>
          </div>
          <Badge variant="outline" className={`text-xs ${getStatusColor()}`}>
            {status.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export function GPSMetricCard({
  value = "0",
  status = "normal",
}: {
  value?: string;
  status?: "normal" | "warning" | "critical";
}) {
  return (
    <MetricDataCard
      title="GPS Signal"
      value={value}
      unit="km/h avg"
      status={status}
      icon={<MapPin className="h-4 w-4 text-emerald-600" />}
    />
  );
}


export function FuelMetricCard({
  value = "0",
  status = "normal",
}: {
  value?: string;
  status?: "normal" | "warning" | "critical";
}) {
  return (
    <MetricDataCard
      title="Fuel Level"
      value={value}
      unit="%"
      status={status}
      icon={<Fuel className="h-4 w-4 text-emerald-600" />}
    />
  );
}


export function EmissionsMetricCard({
  value = "0",
  status = "normal",
}: {
  value?: string;
  status?: "normal" | "warning" | "critical";
}) {
  return (
    <MetricDataCard
      title="CO2 Emissions"
      value={value}
      unit="g/km"
      status={status}
      icon={<Gauge className="h-4 w-4 text-emerald-600" />}
    />
  );
}

