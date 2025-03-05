
"use cleint";

// 8. ExportUtils for PDF and Excel export (ExportUtils.tsx)
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { User } from "@/types/types";

// Function to export selected users to PDF
export const exportToPDF = (selectedUsers: User[]) => {
  if (selectedUsers.length === 0) return;

  const doc = new jsPDF();

  // Define columns for the PDF table
  const tableColumn = [
    "ID",
    "Name",
    "Email",
    "Role",
    "Phone",
    "Cars",
    "Devices"
  ];

  const tableRows = selectedUsers.map((user) => [
    user.id ?? "",
    user.username ?? "",
    user.email ?? "",
    user.role ?? "",
    user.phoneNumber ?? "",
    user.vehicles.length ?? 0,
    user.trackingDevices.length ?? 0
  ]);

  // Add title
  doc.text("User Data Export", 14, 15);

  // Add export date
  const date = new Date().toLocaleDateString();
  doc.text(`Export Date: ${date}`, 14, 23);

  // Add the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30
  });

  // Save the PDF
  doc.save(`users-export-${date}.pdf`);
};

// Function to export selected users to Excel
export const exportToExcel = (selectedUsers: User[]) => {
  if (selectedUsers.length === 0) return;

  // Prepare the data for Excel
  const workSheetData = selectedUsers.map((user) => ({
    ID: user.id,
    Name: user.username,
    Email: user.email,
    Role: user.role,
    Phone: user.phoneNumber,
    "Number of Cars": user.vehicles.length,
    "Number of Devices": user.trackingDevices.length
  }));

  // Create a workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(workSheetData);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

  // Generate Excel file
  const date = new Date().toLocaleDateString().replace(/\//g, "-");
  XLSX.writeFile(workbook, `users-export-${date}.xlsx`);
};
