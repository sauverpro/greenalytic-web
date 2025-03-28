"use client";

import React from "react";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridRowSelectionModel,
} from "@mui/x-data-grid";
import { Button } from "@/components/ui/button";
import { Download, FileType, Printer } from "lucide-react";
import { User } from "@/types/types";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    <ThemeProvider theme={muiTheme}>
      <GridToolbarContainer className="flex justify-between p-3 border-b bg-gray-50 rounded-t-md">
        <div className="flex gap-2">
          <div
            className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm"
          >
            <GridToolbarColumnsButton />
          </div>
          <div
            className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm"
          >
            <GridToolbarFilterButton />
          </div>
          <div
            className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm"
          >
            <GridToolbarDensitySelector />
          </div>
          <div
            className="flex items-center gap-1 bg-white hover:bg-gray-100 shadow-sm"
          >
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
    </ThemeProvider>
  );
};

export default TableToolbar;
