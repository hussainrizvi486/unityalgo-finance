import type React from "react";
import { useState } from "react";
import { Calendar } from "./calender";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover_custom";
import { Button } from "./button";
import { cn } from "../../utils";
import moment from "moment";

interface DatePickerProps {
    name: string;
    value?: Date | undefined;
    defaultValue?: Date | undefined;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    dateFormat?: (date: Date) => string;
}

const defaultDateFormat = (date: Date | string): string => {
    return moment(date).format("MMM D, YYYY");
};


export const DatePicker: React.FC<DatePickerProps> = ({
    name,
    value: controlledValue,
    defaultValue,
    onChange,
    placeholder = "Select Date",
    disabled = false,
    className,
    dateFormat = defaultDateFormat
}) => {
    const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue);
    const [open, setOpen] = useState(false);

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleChange = (date: Date | undefined) => {
        if (!isControlled) {
            setInternalValue(date);
        }
        onChange?.(date);
        setOpen(false); // Close popover after selection
    };

    const displayValue = value ? dateFormat(value) : placeholder;

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                    <button
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between text-left font-normal h-9 px-3 border border-input flex items-center rounded-md ",
                            !value && "text-muted-foreground"
                        )}
                        aria-label={`${name} date picker`}
                        aria-expanded={open}
                        aria-haspopup="dialog"
                    >
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="text-sm">{displayValue}</span>
                        </div>
                        <ChevronDownIcon
                            className={cn(
                                "h-4 w-4 transition-transform",
                                open && "rotate-180"
                            )}
                        />
                    </button>
                </PopoverTrigger>

                <PopoverContent className="p-0 max-w-[2u50px]" >
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={handleChange}
                        className="w-full h-full shadow-none border-0"
                        disabled={disabled}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            {/* Hidden input for form submission */}
            <input
                type="hidden"
                name={name}
                value={value ? moment(value).format("YYYY-MM-DD") : ""}
            />
        </div>
    );
};