"use client";

import jsPDF from "jspdf";
// Import the autoTable plugin properly
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { TrackingDeviceWithVehicle } from "./TrackingDevicesTable";

// Define a proper Device interface


// Export to PDF function
export const exportToPDF = (devices: TrackingDeviceWithVehicle[]): void => {
  try {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Devices Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Prepare table data
    const tableColumn = [
      "ID",
      "Device Model",
      "Serial Number",
      "Status",
      "Type",
      "Plate Number",
      "Active",
      "Assigned To"
    ];
    const tableRows = devices.map((device) => [
      device.id,
      device.model,
      device.serialNumber,

      device.type,
      device.plateNumber || "N/A",
      device.isActive ? "Yes" : "No",
   
    ]);

    // Use the autoTable function
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [6, 81, 61] }, // Primary color
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    // Save the PDF
    doc.save(`devices_report_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Export to Excel function
export const exportToExcel = (devices: TrackingDeviceWithVehicle[]): void => {
  try {
    // Prepare data for Excel
    const worksheet = XLSX.utils.json_to_sheet(
      devices.map((device) => ({
        ID: device.id,
        "Device Model": device.model,
        "Serial Number": device.serialNumber,

        Type: device.type,
        "Plate Number": device.plateNumber || "N/A",
        Active: device.isActive ? "Yes" : "No",
   
      
      }))
    );

    // Set column widths
    const columnWidths = [
      { wch: 10 }, // ID
      { wch: 20 }, // Device Model
      { wch: 20 }, // Serial Number
      { wch: 15 }, // Status
      { wch: 15 }, // Type
      { wch: 15 }, // Plate Number
      { wch: 10 }, // Active
      { wch: 20 }, // Assigned To
      { wch: 15 }, // Battery Level
      { wch: 20 } // Last Active
    ];
    worksheet["!cols"] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Devices");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

    // Save the file
    saveAs(
      data,
      `devices_report_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  } catch (error) {
    console.error("Error generating Excel:", error);
    alert("Failed to generate Excel file. Please try again.");
  }
};

// Print function
export const printDevices = (devices: TrackingDeviceWithVehicle[]): void => {
  try {
    // Create a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the report");
      return;
    }

    // Generate HTML content for printing
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Devices Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #06513D; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th { background-color: #06513D; color: white; text-align: left; padding: 8px; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .report-info { margin-bottom: 20px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Devices Report</h1>
        <div class="report-info">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              <th>Device Model</th>
              <th>Serial Number</th>
              <th>Status</th>
              <th>Type</th>
              <th>Plate Number</th>
              <th>Active</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            ${devices
              .map(
                (device) => `
              <tr>
                <td>${device.model}</td>
                <td>${device.serialNumber}</td>
             
                <td>${device.type}</td>
                <td>${device.plateNumber || "N/A"}</td>
                <td>${device.isActive ? "Yes" : "No"}</td>
              
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Write to the new window and print
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.print();
      // printWindow.close() // Uncomment to auto-close after print dialog
    };
  } catch (error) {
    console.error("Error printing devices:", error);
    alert("Failed to print. Please try again.");
  }
};
