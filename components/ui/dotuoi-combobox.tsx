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

interface DoTuoi {
  id: number;
  dotuoi: number;
}

interface DoTuoiComboboxProps {
  doTuoiList: DoTuoi[];
  value: string;
  onChange: (value: string) => void;
}

export function DoTuoiCombobox({
  doTuoiList,
  value,
  onChange,
}: DoTuoiComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          id="dotuoi-combobox-trigger"
        >
          {" "}
          {value && doTuoiList.find((doTuoi) => doTuoi.id.toString() === value)
            ? `${
                doTuoiList.find((doTuoi) => doTuoi.id.toString() === value)
                  ?.dotuoi
              } tuổi`
            : "Chọn độ tuổi..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Tìm độ tuổi..." className="h-9" />
          <CommandEmpty>Không tìm thấy độ tuổi</CommandEmpty>
          <CommandGroup>
            {doTuoiList.map((doTuoi) => (
              <CommandItem
                key={doTuoi.id}
                value={doTuoi.id.toString()}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === doTuoi.id.toString() ? "opacity-100" : "opacity-0"
                  )}
                />
                {doTuoi.dotuoi} tuổi
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
