import { DynamicBarChart } from "@/components/charts/DyanamicBarChart";
import { DynamicLineChart } from "@/components/charts/DynamicLineChart";
import { DynamicPieChartComponent } from "@/components/charts/DynamicPieChart";
import {

  carSalesConfig,
  carSalesData,
  chartConfig,
  dailySalesConfig,
  dailySalesData,
  monthlyDeviceSalesData,
  weeklyClientsData,
  weeklySalesData
} from "@/data/monthlyDeviceSalesData";
import Image from "next/image";

export default function Home() {
  return (
    <div className=" flex flex-col gap-6">
      {/* Summary Cards */}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4">
        {/* Devices Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold">Total Devices</h3>
          <ul className="text-gray-600 mt-2">
            <li>📡 GPS Trackers: 120 ↑ (+5%)</li>
            <li>⚡ Speed Monitors: 80 ↓ (-3%)</li>
            <li>⛽ Fuel Sensors: 65 ↑ (+2%)</li>
          </ul>
        </div>

        {/* Active Devices Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold">Active Devices</h3>
          <ul className="text-gray-600 mt-2">
            <li>📡 GPS Trackers: 110 ↑ (+8%)</li>
            <li>⚡ Speed Monitors: 75 ↓ (-2%)</li>
            <li>⛽ Fuel Sensors: 60 ↑ (+4%)</li>
          </ul>
        </div>

        {/* Clients Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold">Clients</h3>
          <ul className="text-gray-600 mt-2">
            <li>🚗 Individual Owners: 45 ↑ (+10%)</li>
            <li>🏢 Fleet Managers: 30 ↓ (-5%)</li>
            <li>🛻 Transport Companies: 25 ↑ (+3%)</li>
          </ul>
        </div>

        {/* User Roles Summary */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="text-lg font-semibold">User Roles</h3>
          <ul className="text-gray-600 mt-2">
            <li>🌐 Web Users: 250 ↑ (+12%)</li>
            <li>🔑 Admins: 15 (No Change)</li>
            <li>👥 Other Roles: 8 ↓ (-2%)</li>
          </ul>
        </div>
      </div>
      {/* Two-Column Layout - Fully Optimized */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
        {/* Left Card: Revenue Overview */}
        <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
          <h3 className="text-lg font-semibold">💰 Revenue Overview</h3>

          <div className="mt-4 flex flex-col space-y-4">
            {/* Total Revenue */}
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span className="text-gray-700 font-medium">Total Revenue</span>
              <span className="text-green-600 text-xl font-bold">$27,600</span>
            </div>

            {/* Revenue Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  📡 GPS Trackers
                </span>
                <span className="block text-green-500 font-semibold">
                  +7% ↑
                </span>
                <span className="block text-gray-700 font-medium">$12,500</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  ⚡ Speed Monitors
                </span>
                <span className="block text-red-500 font-semibold">-4% ↓</span>
                <span className="block text-gray-700 font-medium">$8,200</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  ⛽ Fuel Sensors
                </span>
                <span className="block text-green-500 font-semibold">
                  +3% ↑
                </span>
                <span className="block text-gray-700 font-medium">$6,900</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">Compared to last week</p>
        </div>

        {/* Right Card: Clients Overview */}
        <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
          <h3 className="text-lg font-semibold">👥 Clients Overview</h3>

          <div className="mt-4 flex flex-col space-y-4">
            {/* Total Clients */}
            <div className="flex justify-between items-center bg-gray-100 p-3 rounded">
              <span className="text-gray-700 font-medium">Total Clients</span>
              <span className="text-blue-600 text-xl font-bold">100+</span>
            </div>

            {/* Client Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  🚗 Individuals
                </span>
                <span className="block text-green-500 font-semibold">
                  +10% ↑
                </span>
                <span className="block text-gray-700 font-medium">45</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">🏢 Fleets</span>
                <span className="block text-red-500 font-semibold">-5% ↓</span>
                <span className="block text-gray-700 font-medium">30</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  🛻 Transport
                </span>
                <span className="block text-green-500 font-semibold">
                  +3% ↑
                </span>
                <span className="block text-gray-700 font-medium">25</span>
              </div>
            </div>

            {/* User Roles */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">🛠️ Admins</span>
                <span className="block text-gray-700 font-medium">12</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  🌍 Web Users
                </span>
                <span className="block text-gray-700 font-medium">60</span>
              </div>
              <div className="bg-gray-100 p-3 rounded text-center">
                <span className="block text-sm text-gray-600">
                  📱 Mobile Users
                </span>
                <span className="block text-gray-700 font-medium">28</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-400">Compared to last month</p>
        </div>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[1fr_2fr_1fr]">
        {/* Right Section: Sales & Clients Overview */}
        <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-4">📊 Daily Statistics</h3>

          {/* Upper: Daily Sales */}
          <div className="bg-gray-100 p-4 rounded mb-3">
            <h4 className="text-sm font-medium">📈 Daily Sales</h4>
            <p className="text-xl font-bold text-green-600">$1,250</p>
            <span className="text-sm text-gray-500">+5% from yesterday</span>
          </div>

          {/* Lower: Daily Clients */}
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="text-sm font-medium">👥 Daily Clients</h4>
            <p className="text-xl font-bold text-blue-600">45</p>
            <span className="text-sm text-gray-500">+3 new today</span>
          </div>
        </div>

        {/* Middle Section: Interactive Map */}
        <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-4">🗺️ Vehicle Tracking</h3>

          {/* Map Placeholder */}
          <div className="bg-gray-200 h-48 rounded flex items-center justify-center">
            <span className="text-gray-600">[Map Here]</span>
          </div>

          {/* Expandable Button */}
          <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Expand Map
          </button>
        </div>

        {/* Left Section: Messages & Active Devices */}
        <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
          <h3 className="text-lg font-semibold mb-4">📩 Notifications</h3>

          {/* Messages */}
          <div className="bg-gray-100 p-4 rounded mb-3">
            <h4 className="text-sm font-medium">📬 New Messages</h4>
            <p className="text-lg font-bold text-gray-800">3 Unread</p>
          </div>

          {/* Today's Active Devices */}
          <div className="bg-gray-100 p-4 rounded">
            <h4 className="text-sm font-medium">📡 Active Devices</h4>
            <p className="text-lg font-bold text-green-600">125</p>
            <span className="text-sm text-gray-500">+10 from yesterday</span>
          </div>
        </div>
      </div>

      {/* Yearly Statistics */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2  self-center grid justify-center items-center flex-cols-1 bg-gray-50">
          📅 Yearly Statistics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Device Sales (Line Chart) */}
          <div className="bg-white  shadow-lg rounded-lg h-[500px]">
            {/* Placeholder for Chart */}

            <DynamicLineChart
              data={monthlyDeviceSalesData}
              config={chartConfig}
              xAxisKey="month"
              yAxisLabel="Sales"
              title="  📈 Device Sales Trend Over the Year"
              description="Shows the sales trend for three devices over the months of the year"
              height="350px"
              width="100%"
            />
          </div>

          {/* Car Clients (Bar Chart) */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold mb-3">
              🚗 Clients by Car Type
            </h3>

            {/* Placeholder for Chart */}
            <div className="bg-gray-200 flex items-center justify-center rounded">
              <DynamicBarChart
                data={carSalesData} // Pass car sales data
                config={carSalesConfig} // Pass bar chart configuration
                xAxisKey="month" // Use "month" as X-axis
              />
            </div>

            {/* Summary */}
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-semibold text-red-600">-3%</span> decline
              from last year.
            </p>
          </div>
        </div>
      </div>

      {/* Weekly Statistics */}
      {/* Weekly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6 p-6">
        {/* Weekly Sales (Devices) */}
        <DynamicPieChartComponent
          title="Weekly Sales"
          description="Sales distribution of 3 device types"
          data={weeklySalesData}
        />

        {/* Weekly Clients (Car Types) */}
        <DynamicPieChartComponent
          title="Weekly Clients"
          description="Client distribution across 3 car types"
          data={weeklyClientsData}
        />
      </div>

      {/* Daily Statistics */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Daily Statistics</h2>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h3 className="font-semibold">Device Sales & Clients</h3>
          <DynamicBarChart
            title="Daily Sales"
            description="Sales data per device type"
            data={dailySalesData}
            config={dailySalesConfig}
            xAxisKey="day"
          />
          <p>Selecting data for analysis</p>
        </div>
      </div>

      {/* Recent Clients Table */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Clients</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 p-3">Name</th>
                <th className="border border-gray-300 p-3">Car Plate</th>
                <th className="border border-gray-300 p-3">Email</th>
                <th className="border border-gray-300 p-3">Phone</th>
                <th className="border border-gray-300 p-3">Device ID</th>
                <th className="border border-gray-300 p-3">Device Type</th>
                <th className="border border-gray-300 p-3">Date of Deal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-3">John Doe</td>
                <td className="border border-gray-300 p-3">RAC-1234</td>
                <td className="border border-gray-300 p-3">john@example.com</td>
                <td className="border border-gray-300 p-3">+250 78 123 4567</td>
                <td className="border border-gray-300 p-3">DVC-001</td>
                <td className="border border-gray-300 p-3">GPS Tracker</td>
                <td className="border border-gray-300 p-3">2025-02-08</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
