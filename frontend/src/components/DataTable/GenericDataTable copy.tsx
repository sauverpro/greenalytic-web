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

// MUI theme for consistent styling
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

interface Pagination {
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
  fetchData: (
    page: number,
    limit: number
  ) => Promise<{ data: T[]; 
    pagination: Pagination }>;
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
  fetchData,
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
  const [items, setItems] = useState<T[]>([]);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    limit: 10,
  });

  // Add actions column if getRowActions is provided
  const columnsWithActions = getRowActions
    ? [
        ...columns,
        {
          field: "actions",
          headerName: "Actions",
          width: 100,
          sortable: false,
          filterable: false,
          renderCell: (params:any) => {
            const item = params.row as T;
            const actions = getRowActions(item);
            return <TableActions actions={actions} />;
          },
        },
      ]
    : columns;

  // Fetch data with pagination
  const loadData = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await fetchData(page, limit);
      setItems(response.data);
      setFilteredItems(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    loadData(pagination.currentPage, pagination.limit);
  }, [pagination.currentPage, pagination.limit]);

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim() || searchFields.length === 0) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter((item) => {
      return searchFields.some((field) => {
        const value = (item as any)[field];
        return (
          value &&
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    });

    setFilteredItems(filtered);
  }, [searchQuery, items, searchFields]);

  // Custom pagination limit handling
  const handlePaginationLimitChange = (newLimit: number | string) => {
    if (typeof newLimit === "number") {
      setPagination((prev) => ({ ...prev, limit: newLimit, currentPage: 1 }));
      loadData(1, newLimit);
    } else if (newLimit === "all") {
      fetchAllRecords();
    }
  };

  // Function to fetch all records
  const fetchAllRecords = async () => {
    try {
      setLoading(true);
      const response = await fetchData(1, 999999);
      setItems(response.data);
      setFilteredItems(response.data);
      setPagination((prev) => ({
        ...prev,
        limit: response.data.length,
        currentPage: 1,
        totalItems: response.data.length,
      }));
    } catch (error) {
      console.error("Failed to fetch all records", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF export
  const handleExportPDFWrapper = () => {
    if (selectionModel.length === 0 || !handleExportPDF) return;
    try {
      const selectedItems = items.filter((item) =>
        selectionModel.includes(item.id as never)
      );
      handleExportPDF(selectedItems as T[]);
    } catch (error) {
      console.error("Error in PDF export wrapper:", error);
    }
  };

  // Handle Excel export
  const handleExportExcelWrapper = () => {
    if (selectionModel.length === 0 || !handleExportExcel) return;
    try {
      const selectedItems = items.filter((item) =>
        selectionModel.includes(item.id as never)
      );
      handleExportExcel(selectedItems as T[]);
    } catch (error) {
      console.error("Error in Excel export wrapper:", error);
    }
  };

  // Handle Print
  const handlePrintWrapper = () => {
    if (selectionModel.length === 0 || !handlePrint) return;
    try {
      const selectedItems = items.filter((item) =>
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
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: newPaginationModel.page + 1,
                  }))
                }
                slots={{
                  toolbar: (props) => (
                    <TableToolbar
                      selectedRows={selectionModel}
                      data={items as any[]}
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
