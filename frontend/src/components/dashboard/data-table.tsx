"use client"

import { useState, useEffect } from "react"
import { DataGrid, type GridColDef, type GridPaginationModel, type GridSortModel } from "@mui/x-data-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, RefreshCw } from "lucide-react"
import type { PaginationParams } from "@/types"

interface DataTableProps<T> {
  title: string
  columns: GridColDef[]
  data: T[]
  loading: boolean
  totalRows: number
  onPaginationChange: (params: PaginationParams) => void

  onAdd?: () => void
  searchPlaceholder?: string
  filters?: Record<string, any>
  onFilterChange?: (filters: Record<string, any>) => void
}

export function DataTable<T extends { id: number | string }>({
  title,
  columns,
  filters,
  data,
  loading,
  totalRows,
  onPaginationChange,
  // onRefresh,
  onAdd,
  searchPlaceholder = "Search...",
}: DataTableProps<T>) {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>(filters || {})

  useEffect(() => {
    if (filters) {
      setAppliedFilters(filters)
    }
  }, [filters])

  // Debounce search input with immediate update on clear
  useEffect(() => {
    if (searchInput === "") {
      setSearchTerm("")
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
      return
    }
    const handler = setTimeout(() => {
      setSearchTerm(searchInput)
      setPaginationModel((prev) => ({ ...prev, page: 0 })) // reset to first page on new search
    }, 500) // debounce delay 500ms

    return () => clearTimeout(handler)
  }, [searchInput])

  useEffect(() => {
    const params: PaginationParams = {
      page: paginationModel.page + 1, // 0-based to 1-based
      limit: paginationModel.pageSize,
      search: searchTerm || undefined,
      sortBy: sortModel[0]?.field,
      sortOrder: sortModel[0]?.sort || "desc",
      filters: appliedFilters,
    }
    onPaginationChange(params)
  }, [paginationModel, sortModel, searchTerm, appliedFilters, onPaginationChange])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            rowCount={totalRows}
            paginationMode="server"
            sortingMode="server"
            pageSizeOptions={[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 100]}
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid hsl(var(--border))",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "hsl(var(--muted))",
                borderBottom: "1px solid hsl(var(--border))",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: "hsl(var(--background))",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--muted))",
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
