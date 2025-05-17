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

interface PhongCach {
  id: number;
  ten_phong_cach: string;
}

interface PhongCachComboboxProps {
  phongcachList: PhongCach[];
  value: string;
  onChange: (value: string) => void;
}

export function PhongCachCombobox({
  phongcachList,
  value,
  onChange,
}: PhongCachComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="phongcach-combobox-trigger"
        >
          {value && phongcachList.find((pc) => pc.id.toString() === value)
            ? `${
                phongcachList.find((pc) => pc.id.toString() === value)
                  ?.ten_phong_cach
              }`
            : "Chọn phong cách..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm phong cách..." className="h-9" />
          <CommandEmpty>Không tìm thấy phong cách</CommandEmpty>
          <CommandGroup>
            {phongcachList.map((pc) => (
              <CommandItem
                key={pc.id}
                value={pc.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === pc.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {pc.ten_phong_cach}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
