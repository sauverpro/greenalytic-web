"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Pie, Bar, Line } from "react-chartjs-2";
import { DataGrid } from "@mui/x-data-grid";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement
} from "chart.js";
import {
  Users,
  BarChart2,
  ShoppingCart,
  Bell,
  MessageSquare
} from "lucide-react";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Mock Data
const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Monthly Sales ($)",
      data: [5000, 8000, 6000, 12000, 9000, 15000],
      backgroundColor: "#4CAF50"
    },
    {
      label: "Monthly buying ($)",
      data: [55000, 800, 600, 1200, 900, 16000],
      backgroundColor: "#4CAFee"
    }
  ]
};

const lineData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Performance",
      data: [70, 75, 80, 60, 85, 90],
      borderColor: "#FF9800",
      fill: false
    },
    {
      label: "Perfor",
      data: [80, 75, 90, 6, 75, 9],
      borderColor: "#FF98aa",
      fill: false
    }
  ]
};

const pieData = {
  labels: ["Active Devices", "Inactive Devices", "Faulty Devices"],
  datasets: [
    {
      data: [60, 30, 10],
      backgroundColor: ["#4CAF50", "#FFEB3B", "#F44336"]
    }
  ]
};

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "client", headerName: "Client", width: 150 },
  { field: "amount", headerName: "Amount ($)", width: 120 },
  { field: "status", headerName: "Status", width: 100 }
];

const rows = [
  { id: 1, client: "John Doe", amount: 1200, status: "Completed" },
  { id: 2, client: "Alice Brown", amount: 800, status: "Pending" },
  { id: 3, client: "David Smith", amount: 1500, status: "Completed" }
];

export default function Dashboard() {
  return (
    <div className="h-fit grid grid-cols-1 gap-4 p-4">
      {/* 1st Section: Overview Cards */}
      <Grid container spacing={3}>
        {[
          { title: "Total Sales", value: "$45,000", icon: ShoppingCart },
          { title: "Active Devices", value: "120", icon: ShoppingCart },
          { title: "Total Clients", value: "540", icon: Users },
          { title: "Total Devices", value: "150", icon: BarChart2 }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-md">
                <CardContent className="flex items-center space-x-4">
                  <item.icon className="text-green-500 h-10 w-10" />
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h5" className="font-bold">
                      {item.value}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 2nd Section: Clients & Active Users */}
      <Grid container spacing={3} className="">
        {[
          { title: "Total Users", value: "1,200", icon: Users },
          { title: "Active Users", value: "900", icon: Users },
          { title: "New Inquiries", value: "45", icon: MessageSquare }
        ].map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card className="shadow-md">
                <CardContent className="flex items-center space-x-4">
                  <item.icon className="text-blue-500 h-10 w-10" />
                  <div>
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h5" className="font-bold">
                      {item.value}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* 4th & 5th Section: Charts */}
      <Grid container spacing={3} className="">
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h6">Sales Chart</Typography>
                <Bar data={salesData} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h6">Performance Analysis</Typography>
                <Line data={lineData} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* 6th Section: Transactions Table */}
      <Grid container spacing={3} className="">
        <Grid item xs={12}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h6">Recent Transactions</Typography>
                <div style={{ height: 300 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    paginationModel={{ pageSize: 5, page: 0 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* 7th Section: Pie Chart */}
      <Grid container spacing={3} className="">
        <Grid item xs={12} md={6}>
          <motion.div whileHover={{ scale: 1.02 }}>
            <Card className="shadow-md">
              <CardContent>
                <Typography variant="h6">Device Status</Typography>
                <Pie data={pieData} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </div>
  );
}
