import { useState } from "react";
import { useController, Control } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl } from "./form";
import { cn } from "@/lib/utils";

interface MultiSelectDropdownProps {
  items: { id: string; label: string }[];
  name: string;
  control: Control<any>;
  isLoading: boolean;
  search: string;
  onSearch: (search: string) => void;
}

export const MultiSelectDropdown = ({
  items,
  name,
  control,
  isLoading,
  search,
  onSearch,
}: MultiSelectDropdownProps) => {
  const {
    field: { value: selectedItems, onChange },
  } = useController({
    name,
    control,
  });

  const handleCheckboxChange = (id: string) => {
    if (selectedItems.includes(id)) {
      onChange(selectedItems.filter((item: string) => item !== id));
    } else {
      onChange([...selectedItems, id]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !selectedItems.length && "text-muted-foreground"
            )}
          >
            {selectedItems && selectedItems.length > 0
              ? `${selectedItems.length} ${name} selected`
              : `Select ${name}`}
          </Button>
        </FormControl>
        {/* <Button variant="outline">Select Items</Button>
        <span className="ml-2">({selectedItems.length} selected)</span> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[400px] p-0 max-h-[200px] overflow-auto">
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              return onSearch(e.target.value.trim());
            }}
          />
        </div>
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-4 text-center">No data available</div>
        ) : (
          items.map((item) => (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={selectedItems.includes(item.id)}
              onCheckedChange={() => handleCheckboxChange(item.id)}
              className="flex items-center space-x-2"
            >
              {item.label}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
