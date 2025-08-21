/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useCallback, type ReactNode, useEffect, type ReactElement } from "react";
import { cn } from "../../utils";

type PopoverPosition = 'top' | 'bottom' | 'left' | 'right';

interface PopoverTriggerProps {
    children: ReactElement;
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

const PopoverContent: React.FC<PopoverContentProps> = (props) => {
    const context = React.useContext(PopoverContext);
    const [contentPosition, setContentPosition] = useState({ top: 0, left: 0 });
    const contentRef = useRef<HTMLDivElement>(null);

    const { open, position, triggerRef, offset } = context;

    useEffect(() => {
        const updatePosition = () => {
            if (!triggerRef.current || !contentRef.current) return;

            const triggerRect = triggerRef.current.getBoundingClientRect();
            const contentRect = contentRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = 0;
            let left = 0;

            switch (position) {
                case 'bottom':
                    top = triggerRect.bottom + offset;
                    left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
                    break;
                case 'top':
                    top = triggerRect.top - contentRect.height - offset;
                    left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
                    break;
                case 'right':
                    top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
                    left = triggerRect.right + offset;
                    break;
                case 'left':
                    top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
                    left = triggerRect.left - contentRect.width - offset;
                    break;
            }

            // Adjust for viewport boundaries
            if (left < offset) {
                left = offset;
            } else if (left + contentRect.width > viewportWidth - offset) {
                left = viewportWidth - contentRect.width - offset;
            }

            if (top < offset) {
                top = offset;
            } else if (top + contentRect.height > viewportHeight - offset) {
                top = viewportHeight - contentRect.height - offset;
            }

            setContentPosition({ top, left });
        };

        if (open) {
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition);
            };
        }
    }, [open, position, offset, triggerRef]);

    if (!open) return null;

    return (
        <div
            ref={contentRef}
            data-popover-content
            data-state={open ? "open" : "closed"}
            data-side={position}
            style={{
                position: 'fixed',
                top: contentPosition.top,
                left: contentPosition.left,
                // zIndex: 50,
            }}
            className={cn(
                "rounded-md border p-4 shadow-md outline-hidden w-80 bg-white z-50",
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
            const originalRef = (children as ReactElement & { ref?: any }).ref;
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


const PopoverClose: React.FC<PopoverTriggerProps> = (props) => {
    const context = React.useContext(PopoverContext);
    const { triggerRef, setOpen, open } = context;

    const handleClose = () => {
        setOpen(false);
    }

    return React.cloneElement(React.Children.only(props.children), {
        ref: (node: HTMLElement) => {
            triggerRef.current = node;
            const originalRef = (props.children as ReactElement & { ref?: any }).ref;
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
            handleClose();
            // Call original onClick if it exists
            const originalOnClick = (props.children as any).props?.onClick;
            if (originalOnClick) {
                originalOnClick(e);
            }
        }
    })
}

export { Popover, PopoverContent, PopoverTrigger, PopoverClose };