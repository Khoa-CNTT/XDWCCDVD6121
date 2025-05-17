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

interface SoGhe {
  id: number;
  so_luong_ghe: number;
}

interface SoGheComboboxProps {
  soGheList: SoGhe[];
  value: string;
  onChange: (value: string) => void;
}

export function SoGheCombobox({
  soGheList,
  value,
  onChange,
}: SoGheComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="soghe-combobox-trigger"
        >
          {value && soGheList.find((soghe) => soghe.id.toString() === value)
            ? `${
                soGheList.find((soghe) => soghe.id.toString() === value)
                  ?.so_luong_ghe
              } ghế`
            : "Chọn số ghế..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm số ghế..." className="h-9" />
          <CommandEmpty>Không tìm thấy số ghế</CommandEmpty>
          <CommandGroup>
            {soGheList.map((soghe) => (
              <CommandItem
                key={soghe.id}
                value={soghe.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === soghe.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {soghe.so_luong_ghe} ghế
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
