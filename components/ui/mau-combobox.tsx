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

interface Mau {
  id: number;
  ten_mau: string;
}

interface MauComboboxProps {
  mauList: Mau[];
  value: string;
  onChange: (value: string) => void;
}

export function MauCombobox({ mauList, value, onChange }: MauComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="mau-combobox-trigger"
        >
          {" "}
          {value && mauList.find((mau) => mau.id.toString() === value)
            ? mauList.find((mau) => mau.id.toString() === value)?.ten_mau
            : "Chọn màu..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm màu..." className="h-9" />
          <CommandEmpty>Không tìm thấy màu</CommandEmpty>
          <CommandGroup>
            {mauList.map((mau) => (
              <CommandItem
                key={mau.id}
                value={mau.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === mau.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {mau.ten_mau}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
