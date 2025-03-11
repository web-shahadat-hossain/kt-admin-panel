import React, { useRef, useState } from "react";
import { useController, Control } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, XIcon } from "lucide-react";
import { FormLabel } from "./form";

interface DynamicDropdownProps {
  placeholder: string;
  name: string;
  control: Control<any>;
  onSearch: (search: string) => void;
  listing: { id: string; label: string }[];
  canLocalSearch?: boolean;
  onItemSelect: (id: string) => void;
}

export const DynamicDropdown = ({
  placeholder,
  name,
  control,
  onSearch,
  listing,
  onItemSelect,
  canLocalSearch = true,
}: DynamicDropdownProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    field: { value: selectedItem, onChange },
  } = useController({
    name,
    control,
  });

  const handleItemClick = (id: string) => {
    onChange(id);
    onItemSelect(id);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (canLocalSearch) {
      setSearchTerm("");
    } else {
      onSearch("");
    }
    onItemSelect("");
  };

  const filteredItems = listing?.filter((item) =>
    item?.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center justify-between w-full">
              <span className="font-normal">
                {selectedItem
                  ? listing.find((item) => item.id === selectedItem)?.label
                  : placeholder}
              </span>
              {!selectedItem && (
                <ChevronDownIcon className="h-4 w-4 ml-2 text-gray-500" />
              )}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 max-h-60 overflow-y-auto">
          <div className="sticky top-0 bg-white p-2 z-10">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                if (canLocalSearch) {
                  setSearchTerm(e.target.value);
                } else {
                  onSearch(e.target.value);
                }
              }}
              className="mb-2"
            />
          </div>
          {filteredItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onSelect={() => handleItemClick(item.id)}
              className={`flex items-center space-x-2 ${
                selectedItem === item.id ? "bg-gray-200" : ""
              }`}
            >
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedItem && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0"
          onClick={handleClear}
        >
          <XIcon className="h-4 w-4 text-gray-500" />
        </Button>
      )}
    </div>
  );
};
