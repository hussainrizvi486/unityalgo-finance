import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from "../../utils/index";

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> {
    onPreviewClick?: () => void;
    previewClassName?: string;
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
}

/**
 * FileInput component with image preview on hover
 * 
 * Displays a file input field that shows a preview of the selected image when hovered
 * Supports both controlled (value) and uncontrolled (defaultValue) modes
 */
const getFilePreviewUrl = (file: File | null | undefined) => {
    if (!file) return null;

    if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
    }

    return null;
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
    ({
        onChange,
        className = "",
        previewClassName = "",
        onPreviewClick,
        value,
        defaultValue,
        onValueChange,
        ...props
    }, ref) => {
        const isControlled = value !== undefined;
        const [open, setOpen] = useState(false);
        const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);
        const [fileInputKey, setFileInputKey] = useState(Date.now());

        // For controlled component, update preview when value changes
        useEffect(() => {
            if (isControlled) {
                // Nothing to do, we use the value directly
            }
        }, [value, isControlled]);

        // For initialization with defaultValue
        useEffect(() => {
            if (defaultValue && !isControlled) {
                setInternalValue(defaultValue);
            }
        }, [defaultValue, isControlled]);

        // Clean up object URL when component unmounts
        useEffect(() => {
            const previewUrl = isControlled ? value : internalValue;

            return () => {
                if (previewUrl && typeof previewUrl === 'string' && previewUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(previewUrl);
                }
            };
        }, [internalValue, value, isControlled]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            const newPreviewUrl = getFilePreviewUrl(file);

            if (!isControlled) {
                setInternalValue(newPreviewUrl);
            }

            // Call the custom value change handler
            onValueChange?.(newPreviewUrl);

            // Call the original onChange handler
            onChange?.(e)

        };

        // Reset functionality
        const resetFileInput = () => {
            if (!isControlled) {
                setInternalValue(null);
            }

            if (onValueChange) {
                onValueChange(null);
            }

            // Reset the file input by changing its key
            setFileInputKey(Date.now());
        };

        const previewUrl = isControlled ? value : internalValue;

        return (
            <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <div
                            className="relative w-full"
                            onMouseEnter={() => previewUrl && setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                        >
                            <input
                                key={fileInputKey}
                                type="file"
                                ref={ref}
                                onChange={handleFileChange}
                                className={cn(
                                    "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
                                    "focus:outline-none focus:ring-1 focus:ring-blue-400 text-sm",
                                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                                    className
                                )}
                                {...props}
                            />
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={resetFileInput}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    aria-label="Clear file selection"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </PopoverTrigger>

                    {previewUrl && (
                        <PopoverContent
                            sideOffset={5}
                            align="start"
                            className="p-1 shadow-lg border border-gray-200"
                            alignOffset={5}
                            onMouseEnter={() => setOpen(true)}
                            onMouseLeave={() => setOpen(false)}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                        >
                            <div
                                className={cn(
                                    "h-40 w-40 flex items-center justify-center cursor-pointer",
                                    "overflow-hidden rounded-md ",
                                    previewClassName
                                )}
                                onClick={onPreviewClick}
                            >
                                <img
                                    src={previewUrl || ''}
                                    alt="Preview"
                                    className="max-h-full max-w-full object-contain"
                                />
                            </div>
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        );
    }
);

FileInput.displayName = "FileInput";