"use  client";
// 2. TableToolbar component (TableToolbar.tsx)
import React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridRowSelectionModel
} from "@mui/x-data-grid";
import { Button } from "@/components/ui/button";
import { Download, FileType, Printer } from "lucide-react";
import { User } from "@/types/types";

interface TableToolbarProps {
  selectedRows: GridRowSelectionModel;
  data: User[];
  handleExportPDF: () => void;
  handleExportExcel: () => void;
}

const TableToolbar = ({
  selectedRows,
  data,
  handleExportPDF,
  handleExportExcel,
  ...props
}: TableToolbarProps) => {
  return (
    <GridToolbarContainer className="flex justify-between p-3 border-b bg-gray-50 rounded-t-md">
      <div className="flex gap-2">
        <div className="text-gray-700 flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarColumnsButton />
        </div>
        <div className="text-gray-700 flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarFilterButton />
        </div>
        <GridToolbarDensitySelector />
        <GridToolbarExport />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <Download size={16} />
          PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <FileType size={16} />
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-1 bg-white hover:bg-gray-100">
          <Printer size={16} />
          Print
        </Button>
      </div>
    </GridToolbarContainer>
  );
};

export default TableToolbar;
