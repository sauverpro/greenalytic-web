import React from "react";
import ReactPaginate from "react-paginate";

const ITEMS_PER_PAGE = 10;

interface EmissionData {
  id: string | number;
  timestamp: string;
  co2: number;
  co: number;
  no: number;
  HC: number;
}

interface FuelData {
  id: string | number;
  timestamp: string;
  level: number;
  consumption: number;
}

interface DataTableProps {
  title: string;
  dataType: "emissions" | "fuel" | "gps";
  data: any[];
  page: number;
  setPage: (page: number) => void;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
}

const DataTable: React.FC<DataTableProps> = ({
  dataType,
  data,
  page,
  setPage,
  isLoading,
  error,
}) => {
  const paginatedData = data.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const renderTableHeaders = () => {
    switch (dataType) {
      case "emissions":
        return (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              CO₂ (ppm)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              CO (ppm)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              NO (ppm)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              HC (ppm)
            </th>
          </>
        );
      case "fuel":
        return (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              Fuel Level (L)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-sms uppercase tracking-wider">
              Fuel Consumption (L/100km)
            </th>
          </>
        );
      default:
        return null;
    }
  };

  const renderTableRows = () => {
    switch (dataType) {
      case "emissions":
        return paginatedData.map((item) => {
          const emissionItem = item as EmissionData;
          return (
            <tr key={emissionItem.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {new Date(emissionItem.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {emissionItem.co2}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {emissionItem.co}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {emissionItem.no}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {emissionItem.HC}
              </td>
            </tr>
          );
        });
      case "fuel":
        return paginatedData.map((item) => {
          const fuelItem = item as FuelData;
          return (
            <tr key={fuelItem.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {new Date(fuelItem.timestamp).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {fuelItem.level}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-sms">
                {fuelItem.consumption}
              </td>
            </tr>
          );
        });
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-sms">
        {dataType === "emissions" ? "📊 Emissions Data" : "⛽ Fuel Data"}
      </h2>
      {isLoading ? (
        <div className="text-center py-4">Loading data...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center py-4">
          No {dataType} data available for the selected time range
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>{renderTableHeaders()}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderTableRows()}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={Math.ceil(data.length / ITEMS_PER_PAGE)}
              onPageChange={({ selected }) => setPage(selected)}
              containerClassName={"flex justify-center mt-4 space-x-1"}
              previousLinkClassName={
                "px-3 py-2 rounded-md bg-gray-100 text-sms hover:bg-gray-200"
              }
              nextLinkClassName={
                "px-3 py-2 rounded-md bg-gray-100 text-sms hover:bg-gray-200"
              }
              pageClassName={
                "px-3 py-2 rounded-md bg-gray-100 text-sms hover:bg-gray-200"
              }
              activeClassName={"bg-blue-500 text-white hover:bg-blue-600"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DataTable;
