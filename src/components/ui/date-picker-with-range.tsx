"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: string;
  from?: Date;
  to?: Date;
  onSelect: (range: { from: Date; to: Date }) => void;
}

export function DatePickerWithRange({
  className,
  from,
  to,
  onSelect,
}: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from || new Date(),
    to: to || addDays(new Date(), 7),
  });

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (selectedRange?.from) {
      const newRange = {
        from: selectedRange.from,
        to: selectedRange.to || selectedRange.from,
      };
      setDate(newRange);
      onSelect(newRange);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd MMMM yyyy", { locale: fr })} -{" "}
                  {format(date.to, "dd MMMM yyyy", { locale: fr })}
                </>
              ) : (
                format(date.from, "dd MMMM yyyy", { locale: fr })
              )
            ) : (
              <span>Sélectionnez une période</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
            locale={fr}
            labels={{
              caption: "Sélection de la période",
              open: "Ouvrir",
              close: "Fermer",
              action: "Valider",
              selected: "Sélectionné",
              today: "Aujourd'hui",
              next: "Suivant",
              previous: "Précédent",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
