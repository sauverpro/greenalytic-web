
"use cleint";
// 6. PaginationControls component (PaginationControls.tsx)
import React from "react";

interface PaginationControlsProps {
  limit: number;
  onLimitChange: (limit: number | string) => void;
}

const PaginationControls = ({
  limit,
  onLimitChange
}: PaginationControlsProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "custom") {
      const customLimit = prompt("Enter custom limit:");
      if (customLimit) {
        const parsedLimit = parseInt(customLimit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          onLimitChange(parsedLimit);
        }
      }
    } else if (value === "all") {
      onLimitChange("all");
    } else {
      onLimitChange(parseInt(value, 10));
    }
  };

  return (
    <div className="flex items-center">
      <label className="mr-2 text-sm text-gray-600">Items per page:</label>
      <select
        value={limit}
        onChange={handleChange}
        className="p-2 border rounded h-9 bg-white text-sm">
        {[10, 25, 50, 100, 250, 500].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        <option value="custom">Custom</option>
        <option value="all">All</option>
      </select>
    </div>
  );
};

export default PaginationControls;
