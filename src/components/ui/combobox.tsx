"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandList,
  CommandInput,
  CommandItem,
  CommandGroup,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { cn } from "~/lib/utils";

interface Props extends ButtonProps {
  data: {
    id: string;
    name: string;
    [key: string]: unknown;
  }[];
  value?: string;
  setValue?: (value: string) => void;
  placeholder: string;
  keywords?: string[];
}

const ComboBox: React.FunctionComponent<Props> = ({
  data,
  value,
  setValue,
  placeholder,
  className,
  children,
  keywords,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...props}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[200px] justify-between", className)}
          >
            {data.find((ele) => ele.id === value)?.name ?? placeholder}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          container={containerRef.current}
          className="w-[200px] p-0"
        >
          <Command loop>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>No results.{children}</CommandEmpty>
              <CommandGroup>
                {data.map((ele) => (
                  <CommandItem
                    key={ele.id}
                    value={ele.id}
                    onSelect={(currentValue) => {
                      setValue &&
                        setValue(currentValue === value ? "" : ele.id);
                      setOpen(false);
                    }}
                    // By default, command searches in the values provided
                    // Since we want to uniquely identify each item we have passed the id
                    // But we are not searching indexed on the id, rather indexed on the name
                    // Hence we provide additional keywords to match name and get correct results
                    // FIXME(Omkar): This still searches against id provided, implement custom filter() on Command
                    keywords={[
                      ele.name,
                      ...(keywords?.map((key) => {
                        const temp = ele[key];
                        if (typeof temp === "string") return temp;
                        else return "";
                      }) ?? []),
                    ]}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === ele.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {ele.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { ComboBox };
