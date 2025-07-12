"use client";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Button } from "@/components/ui/button";
import { Download, FileType, Printer } from "lucide-react";

interface TableToolbarProps {
  selectedRows: GridRowSelectionModel;
  data: any[];
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
        <div className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarColumnsButton />
        </div>
        <div className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarFilterButton />
        </div>
        <div className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarDensitySelector />
        </div>
        <div className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm">
          <GridToolbarExport />
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100 text-primary border-primary hover:text-primary-dark"
        >
          <Download size={16} />
          PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          disabled={selectedRows.length === 0}
          className="flex items-center gap-1 bg-white hover:bg-gray-100 text-primary border-primary hover:text-primary-dark"
        >
          <FileType size={16} />
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-1 bg-white hover:bg-gray-100 text-primary border-primary hover:text-primary-dark"
        >
          <Printer size={16} />
          Print
        </Button>
      </div>
    </GridToolbarContainer>
  );
};

export default TableToolbar;
