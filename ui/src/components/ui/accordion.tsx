import * as React from "react"
import { cn } from "../../utils/index";
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react";

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className = "", ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn(
            "border-b border-gray-200 transition-colors last:border-0 focus-within:border-gray-300",
            className
        )}
        {...props}
    />
))

AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className = "", children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={
                cn(
                    "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm text-left group",
                    "data-[state=open]:text-primary data-[state=open]:font-semibold",
                    className
                )
            }
            {...props}
        >
            {children}
            <ChevronDown 
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out group-hover:text-primary data-[state=open]:text-primary cursor-pointer accordion-chevron"
                aria-hidden="true"
            />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className = "", children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm transition-all",
            "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
            "data-[state=closed]:duration-300 data-[state=open]:duration-500"
        )}
        {...props}
    >
        <div className={cn("pb-4 pt-0", className)}>
            {children}
        </div>
    </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };