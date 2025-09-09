import * as React from "react"
import { cn } from "../../utils/index";
import { decimal, integer } from "../../utils";

type InputType = "decimal" | "percentage" | "int" | "currency" | "text" | "email" | "password";
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    name?: string;
    type: InputType;
    readOnly?: boolean;
    className?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
}

const formatValue = (value: string, type: InputType): string | number => {
    if (!value || value === '') return '';

    const cleanValue = value.replace(/[$,%]/g, '');

    if (type === "decimal") {
        const numValue = decimal(cleanValue);
        return typeof numValue === 'number' ? numValue : cleanValue;
    }
    if (type == "email") {
        return cleanValue;
    }

    if (type === "percentage") {
        const numValue = decimal(cleanValue);
        return typeof numValue === 'number' ? numValue : cleanValue;
    }
    if (type === "int") {
        const numValue = integer(cleanValue);
        return typeof numValue === 'number' ? numValue : cleanValue;
    }
    if (type === "currency") {
        const numValue = decimal(cleanValue);
        return typeof numValue === 'number' ? numValue : cleanValue;
    }
    if (type === "text") {
        return value;
    }

    return value;
}

const parseValue = (value: string, type: InputType): string => {
    if (type === "text") return value;
    return String(value).replace(/[$,%]/g, '');
}

const displayValue = (value: string | number, type: InputType, isFocused: boolean): string => {
    if (!value && value !== 0) return '';

    if (isFocused) {
        return parseValue(String(value), type);
    }

    if (type === "currency") {
        return typeof value === 'number' ? `$${value.toFixed(2)}` : String(value);
    }
    if (type === "percentage") {
        return typeof value === 'number' ? `${value}%` : String(value);
    }
    if (type === "decimal") {
        return typeof value === 'number' ? value.toFixed(2) : String(value);
    }
    if (type === "int") {
        return typeof value === 'number' ? value.toString() : String(value);
    }

    return String(value);
}

function getPlaceholder(placeholder: string, type: InputType): string {
    return type === "currency" ? "$0.00" : type === "percentage" ? "0%" : type == "decimal" ? "0.00" : type == "int" ? "0" : placeholder;
}

function isNumericType(type: InputType): boolean {
    return ["currency", "percentage", "decimal", "int"].includes(type);
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", onChange, onBlur, value, ...props }, ref) => {
        const [internalValue, setInternalValue] = React.useState(
            value ? formatValue(parseValue(String(value), type), type) : ''
        );

        const [isFocused, setIsFocused] = React.useState(false);

        React.useEffect(() => {
            if (value !== undefined) {
                const formatted = formatValue(parseValue(String(value), type), type);
                setInternalValue(formatted);
            }
        }, [value, type]);

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (type !== "text" && internalValue) {
                const unformatted = parseValue(String(internalValue), type);
                setTimeout(() => {
                    event.target.setSelectionRange(unformatted.length, unformatted.length);
                }, 0);
            }
            props.onFocus?.(event);
        };

        const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            const { value: inputValue } = event.target;
            const formattedValue = formatValue(inputValue, type);
            setInternalValue(formattedValue);

            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: isNumericType(type) ? formattedValue : parseValue(inputValue, type)
                }
            } as React.FocusEvent<HTMLInputElement>;

            onBlur?.(syntheticEvent);
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value: inputValue } = event.target;
            const formattedValue = formatValue(inputValue, type);
            setInternalValue(formattedValue);

            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: isNumericType(type) ? formattedValue : (type === "text" ? inputValue : parseValue(inputValue, type))
                }
            } as React.ChangeEvent<HTMLInputElement>;
            onChange?.(syntheticEvent);
        };

        return (
            <input
                type="text"
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none text-sm file:inline-flex file:h-7 file:border-0 file:bg-transparent  file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20",
                    isNumericType(type) && props.readOnly ? "text-right bg-accent" : "",
                    className
                )}
                ref={ref}
                {...props}
                value={displayValue(internalValue, type, isFocused)}
                onChange={handleChange}
                placeholder={getPlaceholder(props.placeholder, type)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        );
    }
);

Input.displayName = "Input";
export { Input };