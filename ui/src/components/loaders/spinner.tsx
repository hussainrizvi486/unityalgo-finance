import { cn } from "../../utils/index"
import React from "react"

interface SpinnerProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
    color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "light"
    | "dark";
}

export const Spinner: React.FC<SpinnerProps> = ({
    className,
    size = "md",
    color = "primary",
}) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-1",
        md: "w-6 h-6 border-3",
        lg: "w-10 h-10 border-[5px]",
        xl: "w-16 h-16 border-[6px]",
    };

    const colorClasses = {
        primary: "border-primary border-e-transparent",
        secondary: "border-secondary border-e-transparent",
        success: "border-green-500 border-e-transparent",
        warning: "border-yellow-500 border-e-transparent",
        danger: "border-red-500 border-e-transparent",
        info: "border-blue-500 border-e-transparent",
        light: "border-gray-100 border-e-transparent",
        dark: "border-gray-800 border-e-transparent",
    };

    return (
        <div className="flex justify-center items-center w-max">
            <div
                className={cn(
                    "inline-block animate-spin rounded-full border-solid",
                    sizeClasses[size],
                    colorClasses[color],
                    className
                )}
                role="status"
            >
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
};
