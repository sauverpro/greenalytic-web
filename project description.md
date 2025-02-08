# Greenalytic Real-Time Vehicle Monitoring System

## Objective:
The Greenalytic Vehicle Monitoring System is designed to provide real-time tracking and monitoring of multiple vehicles in a fleet. The system collects and displays critical parameters such as speed, GPS location, voltage, fuel level, and carbon emissions, and offers a dashboard for real-time analysis. The system also stores historical data for trend analysis and reporting.

## Core Features:

### 1. Real-Time Vehicle Tracking:
- **Interactive Map:** Displays live GPS locations of all vehicles on an interactive map using **Leaflet.js**.
- **Vehicle Stats:** Tracks speed, fuel level, voltage, and emissions in real-time.
- **Live Updates:** The dashboard auto-refreshes using **WebSockets** or **MQTT** to show the most recent vehicle data.

### 2. Dashboard & Data Visualization:
- **Key Metrics:** Main dashboard displaying the number of active vehicles, alerts, and historical insights.
- **Data Visualization:** Visualizes real-time & historical data through **Chart.js/D3.js** with dynamic charts.
- **Tables:** **MUI Data Grid** is used to list vehicle records, showing the latest status of each vehicle.

### 3. Historical Data & Reports:
- **Trend Analysis:** Collects historical vehicle data for analysis, with time-series graphs.
- **Filters:** Users can filter data by date range and vehicle ID.
- **Reports:** Generates detailed reports on vehicle performance and health.

### 4. Alerts & Notifications:
- **Threshold Alerts:** Generates real-time alerts for issues like low fuel, high speed, and abnormal emissions.
- **Warning System:** Displays warnings on the dashboard and logs them for further review.

### 5. Vehicle Management:
- **Vehicle List:** Displays all registered vehicles in the fleet.
- **Vehicle Detail:** Each vehicle has a dedicated page with stats, historical routes, and maintenance records.

### 6. Settings & User Preferences:
- **Filter Options:** Users can filter data by vehicle, time range, and specific metrics.
- **Customizable Settings:** Users can set preferences for chart types, alert sensitivity, and dashboard layout.

## Technology Stack:

### Frontend (User Interface):
- **Framework:** Next.js (React-based)
- **UI Library:** Material UI (for a clean and responsive design)
- **State Management:** Zustand/Redux Toolkit (for managing app state)
- **Maps & Geospatial Data:** Leaflet.js + React-Leaflet (for real-time vehicle tracking)
- **Charts & Graphs:** Chart.js/D3.js (for visualizing live and historical data)
- **Tables:** MUI Data Grid (for managing vehicle records)

### Backend (To be implemented later):
- **API Framework:** FastAPI/Node.js (Express/Nest.js)
- **Database:** PostgreSQL (with TimescaleDB for time-series data)
- **Real-Time Communication:** WebSockets/MQTT (for continuous updates)
- **Cloud Storage:** AWS S3/Google Cloud Storage (for storing historical logs)

## Development Plan:

### **Phase 1: Frontend Development (Focus)**
- ✅ **Setup Project:** Initialize the **Next.js** project with **Material UI** for a responsive layout.
- ✅ **Build Dashboard UI:** Design the main dashboard UI to show real-time vehicle statistics.
- ✅ **Integrate Leaflet.js:** Set up an interactive map for real-time vehicle tracking with **Leaflet.js**.
- ✅ **Charts & Tables:** Implement **Chart.js**/D3.js for visualizing live and historical data, and use **MUI Data Grid** for vehicle records.

### **Phase 2: Backend & Data Storage**
- 🚧 **Develop API:** Build APIs to manage real-time and historical data.
- 🚧 **Database Setup:** Set up **PostgreSQL** with **TimescaleDB** for storing time-series vehicle telemetry data.
- 🚧 **Real-Time Communication:** Implement **WebSockets** or **MQTT** for live updates between the frontend and backend.
- 🚧 **Cloud Storage:** Set up cloud storage solutions like **AWS S3** or **Google Cloud Storage** for storing historical logs and reports.

## Additional Suggestions:
- **User Authentication:** Implement authentication and role-based access for different user types (admin, driver, etc.).
- **Mobile Compatibility:** Consider building a mobile version or responsive design to support fleet managers who may need to monitor vehicles on the go.
