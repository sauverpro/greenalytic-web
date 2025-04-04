"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import MapSection from "./mapSection";

interface MapWrapperProps {
  isLoading: boolean;
  vehicles: any[];
  stats: {
    totalVehicles?: number;
    activeVehicles?: number;
    inactiveVehicles?: number;
  };
}

export default function MapWrapper({
  isLoading,
  vehicles = [],
  stats = {},
}: MapWrapperProps) {
  const [error, setError] = useState<string | null>(null);

  // Default center location (can be adjusted based on your region)
  const defaultLocation = { lat: -1.94, lng: 30.06 }; // Rwanda coordinates

  // Extract path history for the first vehicle if available
  const pathHistory =
    vehicles.length > 0
      ? vehicles
          .slice(0, 5)
          .map((v) => ({ lat: v.position.lat, lng: v.position.lng }))
      : [];

  const onlineCount = stats.activeVehicles || 0;
  const offlineCount = stats.inactiveVehicles || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Client Vehicle Map</CardTitle>
              <CardDescription>
                Real-time location of all tracked vehicles
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <MapSection
        currentLocation={
          vehicles.length > 0 ? vehicles[0].position : defaultLocation
        }
        pathHistory={[]}
        vehicles={vehicles}
        isLoading={false}
        error={error}
        totalVehicles={stats.totalVehicles || 0}
        vehiclesWithGps={stats.activeVehicles || 0}
      />
    </div>
  );
}