"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationControlsProps {
  limit: number;
  onLimitChange: (limit: number | string) => void;
}

const PaginationControls = ({
  limit,
  onLimitChange,
}: PaginationControlsProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Show:</span>
      <Select
        value={limit.toString()}
        onValueChange={(value) => {
          if (value === "all") {
            onLimitChange("all");
          } else {
            onLimitChange(Number.parseInt(value));
          }
        }}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={limit.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="25">25</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
          <SelectItem value="all">All</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaginationControls;
