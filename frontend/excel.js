const XLSX = require('xlsx')

// Updated student data with Name, Reg No, Email, Marks, and Remark
const studentsData = [
  {
    name: 'John Doe',
    regNo: 'REG12345',
    email: 'student1@example.com',
    marks: 85,
    remark: 'Good'
  },
  {
    name: 'Jane Smith',
    regNo: 'REG12346',
    email: 'student2@example.com',
    marks: 78,
    remark: 'Satisfactory'
  },
  {
    name: 'Alice Johnson',
    regNo: 'REG12347',
    email: 'student3@example.com',
    marks: 92,
    remark: 'Excellent'
  },
  {
    name: 'Bob Brown',
    regNo: 'REG12348',
    email: 'student4@example.com',
    marks: 65,
    remark: 'Needs Improvement'
  }
  // Add more students as needed
]

// Create a new worksheet
const ws = XLSX.utils.json_to_sheet(studentsData)

// Apply styles to the header row (bold and center-aligned)
const headerStyle = {
  font: { bold: true },
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }
}

// Style the header row
const headers = Object.keys(studentsData[0])
headers.forEach((header, index) => {
  const cell = ws[`${String.fromCharCode(65 + index)}1`] // A1, B1, etc.
  if (cell) {
    cell.s = headerStyle
  }
})

// Apply styles to all data rows (center-aligned)
const dataStyle = {
  alignment: { horizontal: 'center', vertical: 'center' },
  border: {
    top: { style: 'thin' },
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' }
  }
}

// Apply style to each data cell
for (let row = 2; row <= studentsData.length + 1; row++) {
  headers.forEach((header, index) => {
    const cell = ws[`${String.fromCharCode(65 + index)}${row}`]
    if (cell) {
      cell.s = dataStyle
    }
  })
}

// Create a new workbook
const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Student Data')

// Write the workbook to a file
XLSX.writeFile(wb, 'students_marks_with_all_data.xlsx')

console.log(
  'Excel file with all student data and style generated successfully!'
)
