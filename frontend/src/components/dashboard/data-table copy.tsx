"use client"

import { useState, useEffect } from "react"
import {
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridSortModel
} from "@mui/x-data-grid"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Pagination } from "@mui/material"
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

  useEffect(() => {
    if (searchInput === "") {
      setSearchTerm("")
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
      return
    }
    const handler = setTimeout(() => {
      setSearchTerm(searchInput)
      setPaginationModel((prev) => ({ ...prev, page: 0 }))
    }, 500)
    return () => clearTimeout(handler)
  }, [searchInput])

  useEffect(() => {
    const params: PaginationParams = {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: searchTerm || undefined,
      sortBy: sortModel[0]?.field,
      sortOrder: sortModel[0]?.sort || "desc",
      filters: appliedFilters,
    }
    onPaginationChange(params)
  }, [paginationModel, sortModel, searchTerm, appliedFilters, onPaginationChange])

  const currentStart = paginationModel.page * paginationModel.pageSize + 1
  const currentEnd = Math.min((paginationModel.page + 1) * paginationModel.pageSize, totalRows)
  const totalPages = Math.ceil(totalRows / paginationModel.pageSize)

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle>{title}</CardTitle>
          <div className="relative w-full sm:w-64">
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
        <div className="h-[600px] w-full">
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
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            hideFooter
            sx={{
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid hsl(var(--border))",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "hsl(var(--muted))",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "hsl(var(--muted))",
              },
            }}
          />
        </div>

<div className="flex flex-wrap items-center justify-between gap-4 mt-6">
  {/* Page size selector */}
  <div className="flex items-center gap-2 min-w-[150px]">
    <label htmlFor="pageSize" className="text-sm whitespace-nowrap">
      Rows per page:
    </label>
    <select
      id="pageSize"
      value={paginationModel.pageSize}
      onChange={(e) => {
        const newSize = parseInt(e.target.value)
        setPaginationModel((prev) => ({
          ...prev,
          pageSize: newSize,
          page: 0,
        }))
      }}
      className="border rounded px-2 py-1 text-sm"
    >
      {[10, 25, 50, 100].map((size) => (
        <option key={size} value={size}>
          {size}
        </option>
      ))}
    </select>
  </div>

  {/* Range display */}
  <div className="text-sm text-muted-foreground min-w-[180px] text-center sm:text-right">
    Showing {currentStart}–{currentEnd} of {totalRows} users
  </div>

  {/* Pagination buttons */}
  <div className="w-full sm:w-auto">
    <Pagination
      count={totalPages}
      page={paginationModel.page + 1}
      onChange={(_, newPage) =>
        setPaginationModel((prev) => ({ ...prev, page: newPage - 1 }))
      }
      showFirstButton
      showLastButton
      color="primary"
      shape="rounded"
      siblingCount={1}
      boundaryCount={1}
    />
  </div>
</div>

      </CardContent>
    </Card>
  )
}
