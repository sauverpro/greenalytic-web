"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  DataGrid,
  type GridRowSelectionModel,
  type GridColDef,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PaginationControls from "@/app/(admin)/admin/users/_components/PaginationControls";
import TableToolbar from "@/app/(admin)/admin/users/_components/TableToolbar";
import TableActions, { type ActionItem } from "./TableActions";
import SearchAndFilter from "@/app/(admin)/admin/users/_components/SearchAndFilter";

 
const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#06513D",
    },
    text: {
      primary: "#06513D",
      secondary: "#059669",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: "#06513D",
          "&:hover": {
            backgroundColor: "rgba(6, 81, 61, 0.04)",
          },
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: "#06513D",
        },
      },
    },
  },
});

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface DataTableProps<T> {
  title: string;
  description: string;
  icon: React.ReactNode;
  columns: GridColDef[];
  data: T[];
  pagination: Pagination;
  loading?: boolean;
  onPageChange: (page: number, limit: number) => void;
  addButtonLabel?: string;
  onAddItem?: () => void;
  searchPlaceholder?: string;
  searchFields?: string[];
  handleExportPDF?: (selectedItems: T[]) => void;
  handleExportExcel?: (selectedItems: T[]) => void;
  handlePrint?: (selectedItems: T[]) => void;
  bulkActionsComponent?: React.ReactNode;
  getRowActions?: (item: T) => ActionItem[];
}

function DataTable<T extends { id: string | number }>({
  title,
  description,
  icon,
  columns,
  data,
  pagination,
  loading = false,
  onPageChange,
  addButtonLabel = "",
  onAddItem,
  searchPlaceholder = "Search...",
  searchFields = [],
  handleExportPDF,
  handleExportExcel,
  handlePrint,
  bulkActionsComponent,
  getRowActions,
}: DataTableProps<T>) {
  const [filteredItems, setFilteredItems] = useState<T[]>(data);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [searchQuery, setSearchQuery] = useState("");

   
  const columnsWithActions = getRowActions
    ? [
        ...columns,
        {
          field: "actions",
          headerName: "Actions",
          width: 100,
          sortable: false,
          filterable: false,
          renderCell: (params: any) => {
            const item = params.row as T;
            const actions = getRowActions(item);
            return <TableActions actions={actions} />;
          },
        },
      ]
    : columns;

   
  useEffect(() => {
    if (!searchQuery.trim() || searchFields.length === 0) {
      setFilteredItems(data);
      return;
    }

    const filtered = data.filter((item) => {
      return searchFields.some((field) => {
        const value = (item as any)[field];
        return (
          value &&
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    });

    setFilteredItems(filtered);
  }, [searchQuery, data, searchFields]);

   
  const handlePaginationLimitChange = (newLimit: number | string) => {
    if (typeof newLimit === "number") {
      onPageChange(1, newLimit);
    } else if (newLimit === "all") {
       
      onPageChange(1, 999999);
    }
  };

   
  const handleExportPDFWrapper = () => {
    if (selectionModel.length === 0 || !handleExportPDF) return;
    try {
      const selectedItems = data.filter((item) =>
        selectionModel.includes(item.id as never)
      );
      handleExportPDF(selectedItems as T[]);
    } catch (error) {
      console.error("Error in PDF export wrapper:", error);
    }
  };

   
  const handleExportExcelWrapper = () => {
    if (selectionModel.length === 0 || !handleExportExcel) return;
    try {
      const selectedItems = data.filter((item) =>
        selectionModel.includes(item.id as never)
      );
      handleExportExcel(selectedItems as T[]);
    } catch (error) {
      console.error("Error in Excel export wrapper:", error);
    }
  };

   
  const handlePrintWrapper = () => {
    if (selectionModel.length === 0 || !handlePrint) return;
    try {
      const selectedItems = data.filter((item) =>
        selectionModel.includes(item.id as never)
      );
      handlePrint(selectedItems as T[]);
    } catch (error) {
      console.error("Error in print wrapper:", error);
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <div className="container mx-auto px-4 py-6 w-full overflow-hidden">
        <Card className="w-full bg-white shadow-md">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-sms flex items-center gap-2">
                  {icon} {title}
                </CardTitle>
                <CardDescription className="text-sms">
                  {description}
                </CardDescription>
              </div>
              {onAddItem && (
                <Button
                  onClick={onAddItem}
                  variant="default"
                  className="bg-primary hover:bg-primary-dark text-white rounded-md shadow-sm"
                >
                  <Plus size={16} className="mr-1" /> {addButtonLabel}
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Search and filter component */}
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder={searchPlaceholder}
              />

              <div className="flex flex-wrap items-center gap-3">
                {/* Bulk actions component */}
                {selectionModel.length > 0 && bulkActionsComponent}

                {/* Pagination controls component */}
                <PaginationControls
                  limit={pagination.limit}
                  onLimitChange={handlePaginationLimitChange}
                />
              </div>
            </div>

            <Box
              sx={{
                height: "auto",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {loading && (
                <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50">
                  <CircularProgress size={40} />
                </div>
              )}
              <DataGrid
                rows={filteredItems}
                columns={columnsWithActions}
                pageSizeOptions={[pagination.limit]}
                paginationMode="server"
                rowCount={pagination.totalItems}
                autoHeight={true}
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                }}
                rowSelectionModel={selectionModel}
                paginationModel={{
                  page: pagination.currentPage - 1,
                  pageSize: pagination.limit,
                }}
                onPaginationModelChange={(newPaginationModel) => 
                  onPageChange(newPaginationModel.page + 1, newPaginationModel.pageSize)
                }
                slots={{
                  toolbar: (props) => (
                    <TableToolbar
                      selectedRows={selectionModel}
                      data={data as any[]}
                      handleExportPDF={handleExportPDFWrapper}
                      handleExportExcel={handleExportExcelWrapper}
                      handlePrint={handlePrint ? handlePrintWrapper : undefined}
                    />
                  ),
                }}
                className="border rounded-md shadow-sm"
                sx={{
                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f9fafb",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  },
                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                  "& .MuiDataGrid-cell": {
                    padding: "12px 16px",
                  },
                  "& .MuiDataGrid-footerContainer": {
                    backgroundColor: "#f9fafb",
                    borderTop: "1px solid #e5e7eb",
                  },
                  "& .MuiTablePagination-root": {
                    color: "#4b5563",
                  },
                  "& .MuiCheckbox-root": {
                    color: "#6b7280",
                  },
                  "& .MuiDataGrid-columnSeparator": {
                    display: "none",
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  );
}

export default DataTable;