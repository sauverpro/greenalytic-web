"use cleint";
// 4. UserTableColumns (UserTableColumns.tsx)
import { GridColDef } from "@mui/x-data-grid";
import { User } from "@/types/types";
import UserActions from "./UserActions";

export const getDataGridColumns = (
  onEditUser: (user: User) => void,
  onAddVehicle: (userId: string) => void,
  onViewUser: (user: User) => void,
  fetchUsers: Function,
  pagination: { currentPage: number; limit: number }
): GridColDef[] => {
  return [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "image",
      headerName: "Profile",
      width: 80,
      renderCell: (params) => (
        <div className="flex justify-center w-full">
          <img
            src={params.value || "/placeholder-avatar.png"}
            alt="User"
            className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Name",
      width: 180,
      renderCell: (params) => <div className="font-medium">{params.value}</div>,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => <div className="text-sms">{params.value}</div>,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => {
        let bgColor = "bg-gray-100";
        let textColor = "text-sms";

        if (params.value === "admin") {
          bgColor = "bg-blue-100";
          textColor = "text-blue-700";
        } else if (params.value === "manager") {
          bgColor = "bg-green-100";
          textColor = "text-green-700";
        } else if (params.value === "user") {
          bgColor = "bg-purple-100";
          textColor = "text-purple-700";
        }

        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
          >
            {params.value}
          </div>
        );
      },
    },
    {
      field: "phoneNumber",
      headerName: "Phone",
      width: 150,
      renderCell: (params) => <div className="text-sms">{params.value}</div>,
    },
    {
      field: "vehicles",
      headerName: "Cars",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-sms px-2 py-1 rounded text-xs font-medium">
          {params.value.length}
        </div>
      ),
    },
    {
      field: "trackingDevices",
      headerName: "Devices",
      width: 80,
      renderCell: (params) => (
        <div className="bg-gray-100 text-sms px-2 py-1 rounded text-xs font-medium">
          {params.value.length}
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <UserActions
          user={params.row}
          onEditUser={onEditUser}
          onAddVehicle={onAddVehicle}
          onViewUser={onViewUser}
          refetchUsers={() =>
            fetchUsers(pagination.currentPage, pagination.limit)
          }
        />
      ),
    },
  ];
};
