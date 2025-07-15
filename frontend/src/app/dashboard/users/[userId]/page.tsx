"use client"

import { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Car,
  Smartphone,
  AlertTriangle,
  FileText,
  Bell,
} from "lucide-react"
import { type GetUserByIdResponse, UserStatus } from "@/types"
import apiClient from "@/lib/api/axios"
import { UpdateAndAddUserSheet } from "../_UserComponents/UpdateAndAddUser"
import { DeleteUserDialog } from "../_UserComponents/DeleteUserDialog"

interface UserDetailPageProps {
  params: Promise<{
    userId: string
  }>
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const resolvedParams = use(params) as { userId: string }
  const router = useRouter()
  const [user, setUser] = useState<GetUserByIdResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    fetchUser()
  }, [resolvedParams.userId])

  const fetchUser = async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get(`/users/${resolvedParams.userId}`)
      setUser(response.data.data)
    } catch (error) {
      console.error("Failed to fetch user:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <h2 className="text-2xl font-semibold">User not found</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "default"
      case UserStatus.PENDING_APPROVAL:
        return "secondary"
      case UserStatus.SUSPENDED:
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteDialogOpen(true)} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.username} />
              <AvatarFallback className="text-lg">{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{user.username}</CardTitle>
            <Badge variant={getStatusColor(user.status)} className="w-fit mx-auto">
              {user.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            {user.phoneNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phoneNumber}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
            {user.companyName && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{user.companyName}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Role</label>
                <div className="mt-1">
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Language</label>
                <div className="mt-1 text-sm">{user.language || "English"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <div className="mt-1 text-sm">{user.gender || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Business Sector</label>
                <div className="mt-1 text-sm">{user.businessSector || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notification Preference</label>
                <div className="mt-1 text-sm">{user.notificationPreference || "Email"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.vehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.trackingDevices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.alerts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.reports}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user._count.userNotifications}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Vehicles */}
        {user.vehicles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Vehicles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{vehicle.plateNumber}</div>
                    <div className="text-xs text-muted-foreground">{vehicle.vehicleModel}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {vehicle.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Devices */}
        {user.trackingDevices.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.trackingDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium text-sm">{device.serialNumber}</div>
                    <div className="text-xs text-muted-foreground">{device.model}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {device.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Recent Alerts */}
        {user.alerts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.alerts.map((alert) => (
                <div key={alert.id} className="p-2 border rounded">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{alert.title}</div>
                    <Badge variant={alert.isRead ? "outline" : "default"} className="text-xs">
                      {alert.isRead ? "Read" : "Unread"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialogs */}
      {editDialogOpen && <UpdateAndAddUserSheet userId={user.id} isEditing={true} onUserCreated={fetchUser} />}

      <DeleteUserDialog
        user={user}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDeleted={() => router.push("/dashboard/User")}
      />
    </div>
  )
}
