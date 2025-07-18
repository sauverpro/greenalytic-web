"use client"

import { useParams } from "next/navigation"
import { VehicleDetailPage } from "../_components/vehicle-detail-page"


export default function VehicleDetailRoute() {
  
  const params = useParams()
  const vehicleId = Number.parseInt(params.id as string)

  if (!vehicleId || isNaN(vehicleId)) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Vehicle ID</h1>
        </div>
      </div>
    )
  }

  return <VehicleDetailPage vehicleId={vehicleId} />

}
