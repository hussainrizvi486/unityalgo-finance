import * as React from "react";
import { cn } from "../../utils/index";

interface BadgeProps {
  color?: "green" | "red" | "blue" | "yellow";
  size?: "none" | "small" | "medium" | "large" | "full";
  radius?: "none" | "small" | "medium" | "large" | "full";
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  color = "blue",
  size = "large",
  radius = "full",
  children,
  className,
}) => {
  const colorClass = {
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
  }[color];

  const sizeClass = {
    none: "px-0 py-0",
    small: "px-2 py-0.5 text-xs",
    medium: "px-3 py-1 text-sm",
    large: "px-4 py-1.5 text-base",
    full: "w-full text-center px-4 py-2 text-lg",
  }[size];

  const radiusClass = {
    none: "rounded-none",
    small: "rounded-sm",
    medium: "rounded-md",
    large: "rounded-lg",
    full: "rounded-full",
  }[radius];

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium transition-colors",
        colorClass,
        sizeClass,
        radiusClass,
        className
      )}
    >
      {children}
    </span>
  );
};
