import * as React from "react"
import { cn } from "../../utils/index";
import { decimal } from "../../utils";

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

const formatValue = (value: string, type: InputType): string => {
    if (!value || value === '') return '';


    const cleanValue = value.replace(/[$,%]/g, '');

    if (type === "decimal") {
        return decimal(cleanValue);
    }
    if (type == "email") {
        return cleanValue;
    }

    if (type === "percentage") {
        const num = parseFloat(cleanValue);
        return isNaN(num) ? '' : `${num.toFixed(2)}%`;
    }
    if (type === "int") {
        const num = parseInt(cleanValue, 10);
        return isNaN(num) ? '' : num.toString();
    }
    if (type === "currency") {
        const num = parseFloat(cleanValue);
        return isNaN(num) ? '' : `$${num.toFixed(2)}`;
    }
    if (type === "text") {
        return value;
    }

    return value;
}

const parseValue = (value: string, type: InputType): string => {
    if (type === "text") return value;
    return value.replace(/[$,%]/g, '');
}

function getPlaceholder(placeholder: string, type: InputType): string {
    return type === "currency" ? "$0.00" : type === "percentage" ? "0%" : type == "decimal" ? "0.00" : type == "int" ? "0" : placeholder;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", onChange, onBlur, value, ...props }, ref) => {


        const [displayValue, setDisplayValue] = React.useState(
            value ? formatValue(String(value), type) : ''
        );


        const [isFocused, setIsFocused] = React.useState(false);
        React.useEffect(() => {
            if (value !== undefined) {
                setDisplayValue(isFocused ? parseValue(value, type) : formatValue(String(value), type));
            }
        }, [value, type, isFocused]);

        const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (type !== "text" && displayValue) {
                const unformatted = parseValue(displayValue, type);
                setDisplayValue(unformatted);
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
            setDisplayValue(formattedValue);

            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: parseValue(inputValue, type)
                }
            } as React.FocusEvent<HTMLInputElement>;

            onBlur?.(syntheticEvent);
        };

        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const { value: inputValue } = event.target;
            setDisplayValue(inputValue);

            const syntheticEvent = {
                ...event,
                target: {
                    ...event.target,
                    value: type === "text" ? inputValue : parseValue(inputValue, type)
                }
            } as React.ChangeEvent<HTMLInputElement>;

            onChange?.(syntheticEvent);
        };

        return (
            <input
                type="text"


                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground  border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50  focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    // isNumericType(type) ? "text-right" : "",
                    className
                )}
                ref={ref}
                {...props}
                value={displayValue}
                onChange={handleChange}
                // defaultValue={formatValue(props.defaultValue, type)}
                placeholder={getPlaceholder(props.placeholder, type)}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        );
    }
);

Input.displayName = "Input";
export { Input };