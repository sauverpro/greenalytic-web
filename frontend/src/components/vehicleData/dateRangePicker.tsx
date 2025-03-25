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

export const formatDateForServer = (
  date: Date,
  isEndDate: boolean = false
): string => {
  if (isEndDate) {
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
    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          From:
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => date && setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="w-full sm:w-auto p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="w-full md:w-auto flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
          To:
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => date && setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          className="w-full sm:w-auto p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div className="w-full md:w-auto">
        <button
          className="w-[7rem] bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleFetchData}
          disabled={!startDate || !endDate}
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
