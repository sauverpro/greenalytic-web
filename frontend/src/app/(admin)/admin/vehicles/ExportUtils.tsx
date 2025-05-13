"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface Vehicle {
  id: number;
  no?: number;
  model: string;
  year: number;
  licensePlate: string;
  chassisNumber: string;
  vehicleType: string;
  usage: string;
  owner: string;
  status: string;
  email?: string;
}
export interface IUpdateVehicle {
  id?: number;
  no?: number;
  model?: string;
  year?: number;
  licensePlate?: string;
  chassisNumber?: string;
  vehicleType?: string;
  usage?: string;
  owner?: string;
  status?: string;
  email?: string;
}

  
export const exportToPDF = (vehicles: Vehicle[]): void => {
  try {
    const doc = new jsPDF();

      
    doc.setFontSize(18);
    doc.text("Vehicles Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      
    const tableColumn = [
      "ID",
      "Model",
      "Year",
      "License Plate",
      "Chassis Number",
      "Type",
      "Usage",
      "Owner",
      "Status",
    ];
    const tableRows = vehicles.map((vehicle, index) => [
      // vehicle.id,
      vehicle.no || index + 1,
      vehicle.model || "N/A",
      vehicle.year || "N/A",
      vehicle.licensePlate || "N/A",
      vehicle.chassisNumber || "N/A",
      vehicle.vehicleType || "N/A",
      vehicle.usage || "N/A",
      vehicle.owner || "N/A",
      vehicle.status || "N/A",
    ]);

      
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [6, 81, 61] },   
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

      
    doc.save(`vehicles_report_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

  
export const exportToExcel = (vehicles: Vehicle[]): void => {
  try {
      
    const worksheet = XLSX.utils.json_to_sheet(
      vehicles.map((vehicle, index) => ({
        // ID: vehicle.id,
        No: vehicle.no || index + 1,
        Model: vehicle.model || "N/A",
        Year: vehicle.year || "N/A",
        "License Plate": vehicle.licensePlate || "N/A",
        "Chassis Number": vehicle.chassisNumber || "N/A",
        Type: vehicle.vehicleType || "N/A",
        Usage: vehicle.usage || "N/A",
        Owner: vehicle.owner || "N/A",
        Status: vehicle.status || "N/A",
        Email: vehicle.email || "N/A",
      }))
    );

      
    const columnWidths = [
      { wch: 10 },   
      { wch: 20 },   
      { wch: 10 },   
      { wch: 15 },   
      { wch: 20 },   
      { wch: 15 },   
      { wch: 15 },   
      { wch: 20 },   
      { wch: 10 },   
      { wch: 30 },   
    ];
    worksheet["!cols"] = columnWidths;

      
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");

      
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

      
    saveAs(
      data,
      `vehicles_report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  } catch (error) {
    console.error("Error generating Excel:", error);
    alert("Failed to generate Excel file. Please try again.");
  }
};

  
export const printVehicles = (vehicles: Vehicle[]): void => {
  try {
      
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the report");
      return;
    }

      
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Vehicles Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #06513D; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th { background-color: #06513D; color: white; text-align: left; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .report-info { margin-bottom: 20px; color: #666; }
          .status-active { color: green; }
          .status-inactive { color: red; }
        </style>
      </head>
      <body>
        <h1>Vehicles Report</h1>
        <div class="report-info">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Year</th>
              <th>License Plate</th>
              <th>Type</th>
              <th>Usage</th>
              <th>Owner</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${vehicles
              .map(
                (vehicle) => `
              <tr>
                <td>${vehicle.model || "N/A"}</td>
                <td>${vehicle.year || "N/A"}</td>
                <td>${vehicle.licensePlate || "N/A"}</td>
                <td>${vehicle.vehicleType || "N/A"}</td>
                <td>${vehicle.usage || "N/A"}</td>
                <td>${vehicle.owner || "N/A"}</td>
                <td class="${
                  vehicle.status === "active"
                    ? "status-active"
                    : "status-inactive"
                }">
                  ${vehicle.status || "N/A"}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

      
    printWindow.document.write(htmlContent);
    printWindow.document.close();

      
    printWindow.onload = () => {
      printWindow.print();
        
    };
  } catch (error) {
    console.error("Error printing vehicles:", error);
    alert("Failed to print. Please try again.");
  }
};
