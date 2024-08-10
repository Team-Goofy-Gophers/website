"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { cn } from "~/lib/utils";

interface Props {
  date: Date | undefined;
  setDate?: React.Dispatch<React.SetStateAction<Date | undefined>>;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  dateDisabled?: (date: Date) => boolean;
  // Useful to wrap trigger button with FormControl
  wrapper?: React.ReactElement;
}

const DatePicker = React.forwardRef<HTMLButtonElement, Props>(
  (
    {
      date,
      setDate,
      placeholder,
      className,
      disabled = false,
      dateDisabled = () => false,
      wrapper,
    },
    ref,
  ) => {
    const DateTrigger: React.ReactElement = (
      <Button
        variant={"outline"}
        className={cn(
          "w-60 justify-start text-left font-normal",
          !date && "text-muted-foreground",
          className,
        )}
        disabled={disabled}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? (
          format(date, "PPP")
        ) : (
          <span>{placeholder ?? "Pick a date"}</span>
        )}
      </Button>
    );

    return (
      <Popover>
        <PopoverTrigger ref={ref} asChild>
          {/* DateTrigger extracted to keep clean code */}
          {wrapper ? React.cloneElement(wrapper, {}, DateTrigger) : DateTrigger}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate && setDate(date);
            }}
            disabled={(date) => date > new Date() || dateDisabled(date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
