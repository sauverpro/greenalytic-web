"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import type { User } from "@/types/types";

interface UserWithNo extends User {
  no?: number;
}
export const exportToPDF = (users: UserWithNo[]): void => {
  try {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Users Report", 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableColumn = [
      "No",
      "Username",
      "Email",
      "Phone",
      "Role",
      "Status",
      "Created At",
    ];
    const tableRows = users.map((user, index) => [
      user.no || index + 1,
      user.username || "N/A",
      user.email || "N/A",
      user.phoneNumber || "N/A",
      user.role || "N/A",
      user.createdAt ? new Date(user.createdAt).toLocaleString() : "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [6, 81, 61] }, 
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save(`users_report_${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

export const exportToExcel = (users: UserWithNo[]): void => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user, index) => ({
        No: user.no || index + 1,
        Username: user.username || "N/A",
        Email: user.email || "N/A",
        Phone: user.phoneNumber || "N/A",
        Role: user.role || "N/A",
        "Created At": user.createdAt
          ? new Date(user.createdAt).toLocaleString()
          : "N/A",
        "Last Login": user.createdAt ? new Date() : "N/A",
        Address: "N/A",
        City: "N/A",
        Country: "N/A",
      }))
    );

    const columnWidths = [
      { wch: 10 },  
      { wch: 20 },  
      { wch: 30 },  
      { wch: 15 },  
      { wch: 15 },  
      { wch: 10 },  
      { wch: 20 },  
      { wch: 20 },  
      { wch: 30 },  
      { wch: 15 },  
      { wch: 15 },  
    ];
    worksheet["!cols"] = columnWidths;

     
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

     
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });

     
    saveAs(data, `users_report_${new Date().toISOString().split("T")[0]}.xlsx`);
  } catch (error) {
    console.error("Error generating Excel:", error);
    alert("Failed to generate Excel file. Please try again.");
  }
};

 
export const printUsers = (users: UserWithNo[]): void => {
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
        <title>Users Report</title>
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
        <h1>Users Report</h1>
        <div class="report-info">Generated on: ${new Date().toLocaleString()}</div>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(
                (user, index) => `
              <tr>
                <td>${user.no || index + 1}</td>
                <td>${user.username || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.phoneNumber || "N/A"}</td>
                <td>${user.role || "N/A"}</td>
                <td>${
                  user.createdAt
                    ? new Date(user.createdAt).toLocaleString()
                    : "N/A"
                }</td>
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
    console.error("Error printing users:", error);
    alert("Failed to print. Please try again.");
  }
};
