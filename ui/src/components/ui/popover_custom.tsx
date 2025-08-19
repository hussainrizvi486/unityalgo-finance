/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useCallback, type ReactNode, useEffect } from "react";
import { cn } from "../../utils";
// import { relativeTimeRounding } from "moment";

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverTriggerProps {
    children: ReactNode;
    asChild?: boolean;
}

interface PopoverContextType {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    triggerRef: React.RefObject<HTMLElement>;
    position: PopoverPosition;
    offset: number;
    trigger: 'click' | 'hover';
}

interface PopoverProps {
    children: ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

const PopoverContext = React.createContext<PopoverContextType | undefined>(undefined);

const Popover: React.FC<PopoverProps> = ({
    children,
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange
}) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const triggerRef = useRef<HTMLElement>(null);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
        const newValue = typeof value === 'function' ? value(open) : value;

        if (!isControlled) {
            setInternalOpen(newValue);
        }

        onOpenChange?.(newValue);
    }, [open, isControlled, onOpenChange]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [open, setOpen]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (open && triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
                const popoverContent = document.querySelector('[data-popover-content]');
                if (popoverContent && !popoverContent.contains(e.target as Node)) {
                    setOpen(false);
                }
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open, setOpen]);

    const contextValue: PopoverContextType = {
        open,
        setOpen,
        triggerRef,
        position: 'bottom',
        offset: 8,
        trigger: 'click'
    };

    return (
        <PopoverContext.Provider value={contextValue}>
            {children}
        </PopoverContext.Provider>
    );
};

interface PopoverContentProps {
    children: ReactNode;
    className?: string;
}

const PopoverContent = (props: PopoverContentProps) => {
    const context = React.useContext(PopoverContext);
    if (!context.open) return <></>;

    const { open, position } = context;

    return (
        <div
            data-popover-content
            data-state={open ? "open" : "closed"}
            data-side={position}
            className={cn(
                "rounded-md border p-4 shadow-md outline-hidden w-80",
                "data-[state=open]:animate-in",
                "data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0",
                "data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95",
                "data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2",
                "data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2",
                "data-[side=top]:slide-in-from-bottom-2",
                props.className
            )}
        >
            {props.children}
        </div>
    );
};

const PopoverTrigger: React.FC<PopoverTriggerProps> = ({
    children
}) => {
    const context = React.useContext(PopoverContext);

    if (!context) {
        throw new Error('PopoverTrigger must be used within a Popover');
    }

    const { setOpen, triggerRef, open } = context;

    const handleClick = () => {
        setOpen(prev => !prev);
    };

    return React.cloneElement(React.Children.only(children) as React.ReactElement, {
        ref: (node: HTMLElement) => {
            triggerRef.current = node;
            // Handle forwarded refs if they exist
            const originalRef = (children as any).ref;
            if (originalRef) {
                if (typeof originalRef === 'function') {
                    originalRef(node);
                } else {
                    originalRef.current = node;
                }
            }
        },
        'data-state': open ? 'open' : 'closed',
        onClick: (e: React.MouseEvent) => {
            handleClick();
            // Call original onClick if it exists
            const originalOnClick = (children as any).props?.onClick;
            if (originalOnClick) {
                originalOnClick(e);
            }
        }
    });
};

export { Popover, PopoverContent, PopoverTrigger }