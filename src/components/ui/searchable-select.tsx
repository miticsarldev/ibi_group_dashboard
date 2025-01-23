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

interface SearchableSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  emptyMessage: string;
  isLoading?: boolean;
}

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder,
  emptyMessage,
  isLoading = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (currentValue: string) => {
      onChange(currentValue === value ? "" : currentValue);
      setOpen(false);
    },
    [onChange, value]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {isLoading
            ? "Chargement..."
            : value
            ? options?.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder={`Rechercher ${placeholder.toLowerCase()}...`}
          />
          <CommandEmpty>
            {isLoading ? "Chargement..." : emptyMessage}
          </CommandEmpty>
          <CommandGroup>
            {options.length > 0 ? (
              options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled>{emptyMessage}</CommandItem>
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
