import * as React from "react"
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "../components/ui/accordion"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from "../components/ui/dropdown";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    TableCaption,
    TableFooter,
} from "../components/ui/table";
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
// import { ComboBox } from "../components/ui/combobox"
// import { TableInput } from "../components/table-input";
import { Dialog, DialogContent, DialogClose, DialogTrigger } from "../components/ui/dialog";

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "../components/ui/popover_custom";

import { Badge } from "../components/ui/badge";
import { CounterButton } from "../components/ui/counter-button";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calender";
import {
    Loader2,
    Plus,
    SquarePen,
    Trash2,
    Calendar as CalendarIcon,
    ChevronDown,
    Settings,
    User,
    LogOut
} from "lucide-react";


// Demo Data
const invoiceData = [
    { id: "INV-001", status: "Paid", amount: "$250.00", date: "2025-07-16" },
    { id: "INV-002", status: "Pending", amount: "$180.00", date: "2025-07-15" },
    { id: "INV-003", status: "Failed", amount: "$320.00", date: "2025-07-14" },
];

const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" },
];

// Individual Demo Components
const CalendarDemo = () => {
    const [date, setDate] = useState();

    return (
        <DemoSection title="Calendar Component">
            <div className="max-w-fit">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                />
            </div>
        </DemoSection>
    );
};

const SelectDemo = () => {
    const [selectedFruit, setSelectedFruit] = useState("");

    return (
        <DemoSection title="Select Component">
            <div className="max-w-xs">
                <Select value={selectedFruit} onValueChange={setSelectedFruit}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Fruits</SelectLabel>
                            {fruits.map((fruit) => (
                                <SelectItem key={fruit.value} value={fruit.value}>
                                    {fruit.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            {selectedFruit && (
                <p className="text-sm text-muted-foreground mt-2">
                    Selected: {fruits.find(f => f.value === selectedFruit)?.label}
                </p>
            )}
        </DemoSection>
    );
};

const InputDemo = () => {
    const [inputValue, setInputValue] = useState("");

    return (
        <DemoSection title="Input Component">
            <div className="space-y-4 max-w-md">
                <div>
                    <label className="text-sm font-medium mb-2 block">Standard Input</label>
                    <Input
                        placeholder="Enter text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Email Input</label>
                    <Input type="email" placeholder="Enter email" />
                </div>
                <div>
                    <label className="text-sm font-medium mb-2 block">Password Input</label>
                    <Input type="password" placeholder="Enter password" />
                </div>
            </div>
        </DemoSection>
    );
};

const CheckboxDemo = () => {
    const [checked, setChecked] = useState(false);
    const [multipleChecks, setMultipleChecks] = useState({
        option1: false,
        option2: true,
        option3: false,
    });

    return (
        <DemoSection title="Checkbox Component">
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="single-checkbox"
                        checked={checked}
                        onCheckedChange={setChecked}
                    />
                    <label htmlFor="single-checkbox" className="text-sm cursor-pointer">
                        Single checkbox option
                    </label>
                </div>

                <div className="space-y-2">
                    <p className="text-sm font-medium">Multiple options:</p>
                    {Object.entries(multipleChecks).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                            <Checkbox
                                id={key}
                                checked={value}
                                onCheckedChange={(checked) =>
                                    setMultipleChecks(prev => ({ ...prev, [key]: checked }))
                                }
                            />
                            <label htmlFor={key} className="text-sm cursor-pointer capitalize">
                                {key.replace(/(\d+)/, ' $1')}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
        </DemoSection>
    );
};

const ButtonDemo = () => {
    const [loading, setLoading] = useState(false);

    const handleLoadingClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 2000);
    };

    return (
        <DemoSection title="Button Component">
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-3">Variants</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="default">Default</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-3">Sizes</h3>
                    <div className="flex flex-wrap gap-3 items-center">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon" aria-label="Icon button">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-3">With Icons</h3>
                    <div className="flex flex-wrap gap-3">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                        <Button
                            disabled={loading}
                            onClick={handleLoadingClick}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <SquarePen className="mr-2 h-4 w-4" />
                            )}
                            {loading ? "Loading..." : "Edit"}
                        </Button>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const DialogDemo = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    return (
        <DemoSection title="Dialog Component">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    {/* <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader> */}
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Username</label>
                            <Input
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block">Email</label>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => setIsOpen(false)}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </DemoSection>
    );
};

const PopoverDemo = () => {
    return (
        <DemoSection title="Popver Component">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        Open Popover
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="space-y-2">
                        <h4 className="font-medium">Popover Content</h4>
                        <p className="text-sm text-muted-foreground">
                            This is the content of the popover. You can put any content here,
                            including forms, lists, or other components.
                        </p>
                        <div className="flex space-x-2 pt-2">
                            <Button size="sm">Action</Button>
                            <PopoverClose>
                                <Button size="sm" variant="outline">Cancel</Button>
                            </PopoverClose>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </DemoSection>
    );
};

const DropdownDemo = () => {
    return (
        <DemoSection title="Dropdown Menu">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Open Menu
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </DemoSection>
    );
};

const BadgeDemo = () => {
    return (
        <DemoSection title="Badge Component">
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium mb-3">Default Badges</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge>Default</Badge>
                        <Badge variant="secondary">Secondary</Badge>
                        <Badge variant="destructive">Destructive</Badge>
                        <Badge variant="outline">Outline</Badge>
                    </div>
                </div>
                <div>
                    <h3 className="text-sm font-medium mb-3">Status Badges</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                        <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
                        <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>
                        <Badge className="bg-blue-500 hover:bg-blue-600">Info</Badge>
                    </div>
                </div>
            </div>
        </DemoSection>
    );
};

const AccordionDemo = () => {
    return (
        <DemoSection title="Accordion Component">
            <Accordion type="single" collapsible className="w-full max-w-md">
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is your return policy?</AccordionTrigger>
                    <AccordionContent>
                        Our return policy allows returns within 30 days of purchase with a receipt.
                        All items must be in original condition and packaging.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer technical support?</AccordionTrigger>
                    <AccordionContent>
                        Yes, we offer 24/7 technical support via email, chat, and phone.
                        Our support team is always ready to help you with any questions.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Where are you located?</AccordionTrigger>
                    <AccordionContent>
                        Our main office is located in San Francisco, California, with additional
                        offices in New York and London.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </DemoSection>
    );
};

const TableDemo = () => {
    const getStatusBadge = (status) => {
        const variants = {
            Paid: "bg-green-500 hover:bg-green-600",
            Pending: "bg-yellow-500 hover:bg-yellow-600",
            Failed: "bg-red-500 hover:bg-red-600"
        };

        return (
            <Badge className={variants[status] || ""}>
                {status}
            </Badge>
        );
    };

    return (
        <DemoSection title="Table Component">
            <div className="rounded-md border">
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoiceData.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                                <TableCell className="text-right">{invoice.amount}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell className="text-right">$750.00</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DemoSection>
    );
};

// Reusable section wrapper
const DemoSection = ({ title, children }) => (
    <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b pb-2">
            {title}
        </h2>
        <div className="pl-1">
            {children}
        </div>
    </section>
);

// Main component
export function DemoComponent() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-8 px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        UI Components Demo
                    </h1>
                    <p className="text-muted-foreground">
                        A comprehensive showcase of all available UI components with interactive examples.
                    </p>
                </header>

                <div className="grid gap-8">
                    <PopoverDemo />
                    <CalendarDemo />
                    <SelectDemo />
                    <InputDemo />
                    <CheckboxDemo />
                    <ButtonDemo />
                    <DialogDemo />
                    <DropdownDemo />
                    <BadgeDemo />
                    <AccordionDemo />
                    <TableDemo />
                </div>
            </div>
        </div>
    );
}