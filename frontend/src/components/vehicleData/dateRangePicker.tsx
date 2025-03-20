import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  fetchAllData: () => void;
}

// Helper function to format date as YYYY-MM-DD
export const formatDateForServer = (
  date: Date,
  isEndDate: boolean = false
): string => {
  if (isEndDate) {
    // For end dates, we create a copy and set time to 23:59:59 to include the full day
    const adjustedDate = new Date(date);
    adjustedDate.setHours(23, 59, 59, 999);
    date = adjustedDate;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseServerDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day); 
};

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  fetchAllData,
}) => {
  useEffect(() => {
    if (!startDate || startDate.toString() === "Invalid Date") {
      setStartDate(parseServerDate("2023-01-01"));
    }

    if (!endDate || endDate.toString() === "Invalid Date") {
      setEndDate(parseServerDate("2025-12-31"));
    }
  }, [startDate, endDate, setStartDate, setEndDate]);

  const handleFetchData = () => {
    console.log("Formatted startDate:", formatDateForServer(startDate));
    console.log("Formatted endDate:", formatDateForServer(endDate, true)); // Note the true flag for endDate

    fetchAllData();
  };

  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
      <div className="flex items-center">
        <span className="mr-2 font-medium">From:</span>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="p-2 border rounded-lg"
          dateFormat="yyyy-MM-dd" 
        />
      </div>
      <div className="flex items-center">
        <span className="mr-2 font-medium">To:</span>
        <DatePicker
          selected={endDate}
          onChange={(date) => date && setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="p-2 border rounded-lg"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <button
        className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        onClick={handleFetchData}
      >
        Apply
      </button>
    </div>
  );
};

export default DateRangePicker;
