"use client";

import React from "react";

export const ChartSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Fuel Level Chart Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="min-h-[400px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
          <div className="w-full h-full">
            <div className="h-full flex flex-col justify-between p-4">
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Fuel Consumption Chart Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="min-h-[400px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
          <div className="w-full h-full">
            <div className="h-full flex items-end justify-between p-4">
              <div className="h-32 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-64 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-48 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-80 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-56 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-40 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 p-4 rounded-lg animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const EmptyDataMessage = () => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center h-64">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-gray-600 font-medium text-lg">
          No data available
        </div>
        <p className="text-gray-500 text-sm mt-1">
          No fuel data could be found for this vehicle
        </p>
      </div>
    </div>
  );
};

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-64">
        <div className="text-red-500">{message}</div>
      </div>
    </div>
  );
};
