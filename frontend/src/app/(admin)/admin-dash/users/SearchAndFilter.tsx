
// 5. SearchAndFilter component (SearchAndFilter.tsx)
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery
}: SearchAndFilterProps) => {
  return (
    <div className="flex-1 w-full md:w-auto max-w-md relative">
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder="Search users by name, email, role..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 bg-white"
      />
    </div>
  );
};

export default SearchAndFilter;
