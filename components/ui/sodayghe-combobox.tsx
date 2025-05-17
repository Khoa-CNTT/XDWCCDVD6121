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

interface SoDayGhe {
  id: number;
  so_luong_day_ghe: number;
}

interface SoDayGheComboboxProps {
  soDayGheList: SoDayGhe[];
  value: string;
  onChange: (value: string) => void;
}

export function SoDayGheCombobox({
  soDayGheList,
  value,
  onChange,
}: SoDayGheComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="sodayghe-combobox-trigger"
        >
          {value &&
          soDayGheList.find((sodayghe) => sodayghe.id.toString() === value)
            ? `${
                soDayGheList.find(
                  (sodayghe) => sodayghe.id.toString() === value
                )?.so_luong_day_ghe
              } dãy`
            : "Chọn số dãy ghế..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm số dãy ghế..." className="h-9" />
          <CommandEmpty>Không tìm thấy số dãy ghế</CommandEmpty>
          <CommandGroup>
            {soDayGheList.map((sodayghe) => (
              <CommandItem
                key={sodayghe.id}
                value={sodayghe.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === sodayghe.id.toString()
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {sodayghe.so_luong_day_ghe} dãy
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
