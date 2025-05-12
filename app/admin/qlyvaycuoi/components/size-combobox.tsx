"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Size {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface SizeComboboxProps {
  sizes: Size[];
  value: string;
  onChange: (value: string) => void;
}

export function SizeCombobox({ sizes, value, onChange }: SizeComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="size-combobox-trigger"
        >
          {value
            ? sizes.find((size) => size.id.toString() === value)?.size
            : "Chọn kích thước..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm kích thước..." className="h-9" />
          <CommandEmpty>Không tìm thấy kích thước</CommandEmpty>
          <CommandGroup>
            {sizes.map((size) => (
              <CommandItem
                key={size.id}
                value={size.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === size.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {size.size} ({size.min_chieu_cao}-{size.max_chieu_cao}cm,{" "}
                {size.min_can_nang}-{size.max_can_nang}kg)
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
