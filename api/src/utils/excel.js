import xlsx from 'xlsx'
import fs from 'fs'

// Sample student data
const students = [
  {
    firstName: 'John',
    lastName: 'Doe',
    marks: 85,
    email: 'john@example.com',
    remark: 'Good'
  },
  {
    firstName: 'Alice',
    lastName: 'Smith',
    marks: 72,
    email: 'alice@example.com',
    remark: 'Average'
  },
  {
    firstName: 'Bob',
    lastName: 'Brown',
    marks: 90,
    email: 'bob@example.com',
    remark: 'Excellent'
  }
]

// Convert data to worksheet
const worksheet = xlsx.utils.json_to_sheet(students)

// Create workbook
const workbook = xlsx.utils.book_new()
xlsx.utils.book_append_sheet(workbook, worksheet, 'Students')

// Save Excel file
xlsx.writeFile(workbook, 'students.xlsx')

console.log('✅ Excel file created: students.xlsx')
