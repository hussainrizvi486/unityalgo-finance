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
import { FileInput, Loader2, Plus, SquarePen, Trash2, X } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar, CalendarDayButton } from "../components/ui/calender";
import { Badge } from "../components/ui/badge";
import { CounterButton } from "../components/ui/counter-button";
import { Button } from "../components/ui/button";


export const DemoComponent = () => {
    return (
        <div className="p-2">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <SelectDemo />
                </div>

                <div className="mb-12">
                    <InputDemo />
                </div >

                <div className="mb-12">
                    <CheckboxDemo />
                </div>
                <div className="mb-12">
                    <DemoCountButton />
                </div>
                {/* <div className="mb-12">
                    <ComboBoxDemo />
                </div> */}

                {/* <div className="mb-12">
                    <InputTable />
                </div> */}
                <div className="mb-12">
                    <ButtonsDemo />
                </div>
                <div className="mb-12">
                    <DialogDemo />
                </div>
                <div className="mb-12">
                    <PopoverDemo />
                </div>
                <div className="mb-12">
                    <DropdownDemo />
                </div>
                <div className="mb-12">
                    <DemoBadge />
                </div>
                <div className="mb-12">
                    <DemoAccordion />
                </div>
                <div className="mb-12">
                    <TableDemo />
                </div>
                <div className="mb-12"></div>
                <div className="mb-12"></div>
            </div>
        </div>
    )
}


function SelectDemo() {
    return (
        <div>
            <div >
                <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Select component</div>
            </div>
            <Select >
                <SelectTrigger >
                    <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent  >
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

function InputDemo() {
    return (
        <>
            <div >
                <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Input component</div>
            </div>
            <Input placeholder="Enter text" />
        </>
    )
}



function CheckboxDemo() {
    return (
        <div>


            <div >
                <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Checkbox</div>
            </div>

            <div className="mb-1 flex items-center ">
                <Checkbox className="mr-2" id="checkbox-demo" />
                <label className="text-sm text-muted-foreground select-none cursor-pointer" htmlFor="checkbox-demo">Click to Disable</label>
            </div>

        </div>
    )
}

// function ComboBoxDemo() {
//     return (
//         <div>
//             <div className="text-sm mb-2 ">Combobox </div>
//             <ComboBox
//                 options={[
//                     { label: "Option 1", value: "option1" },
//                     { label: "Option 2", value: "option2" },
//                     { label: "Option 3", value: "option3" },
//                 ]}
//                 placeholder="Select an option"
//                 onChange={(value) => console.log("Selected:", value)}
//             />
//         </div>
//     )
// }

// function InputTable() {
//     return (
//         <div>
//             <TableInput
//                 fields={[{
//                     "label": "Item Name",
//                     "name": "itemName",
//                     "type": "text",
//                     "placeholder": "Enter item name",
//                     "required": true,
//                 }]}
//             />
//         </div>
//     )

// }


function DialogDemo() {
    return (
        <div>
            <div className="mb-4"><h1 className="text-base font-medium">Dialog Demo</h1></div>
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-2 bg-primary text-primary-foreground text-sm p-2 rounded-md font-medium"
                        type="button" role="button"><SquarePen className="h-4 w-4" />Edit Profile</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]" >
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <div className="">Edit Profile</div>
                            <div>
                                <DialogClose asChild>

                                    <button className="cursor-pointer" aria-label="Close" type="button" role="button">
                                        <X />
                                    </button>
                                </DialogClose>
                            </div>
                        </div>
                        <div>
                            <div className="mb-4">
                                <div className="mb-2 text-sm text-muted-foreground font-medium">Username</div>
                                <Input placeholder="Enter your username" />
                            </div>

                            <div className="mb-2">
                                <div className="mb-2 text-sm text-muted-foreground font-medium">Input component</div>
                                <Input placeholder="Enter text" />
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}


const PopoverDemo = () => {
    return (
        <div>
            <div>
                <Popover>
                    <PopoverTrigger asChild>
                        <button className="bg-primary text-primary-foreground text-sm p-2 rounded-md font-medium">Popover Demo</button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="p-4">This is the content of the popover.</div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

const DemoAccordion = () => {
    return (
        <div className="">
            <div className="mb-4 text-sm text-muted-foreground font-semibold">Accordion</div>
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>What is your return policy?</AccordionTrigger>
                    <AccordionContent>
                        Our return policy allows returns within 30 days of purchase with a receipt.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                    <AccordionTrigger>Do you offer technical support?</AccordionTrigger>
                    <AccordionContent>
                        Yes, we offer 24/7 technical support via email and chat.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                    <AccordionTrigger>Where are you located?</AccordionTrigger>
                    <AccordionContent>
                        Our main office is located in San Francisco, California.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};



const DemoCountButton = () => {
    return (
        <div>
            <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Counter</div>
            <CounterButton />
        </div>
    )
}


const DropdownDemo = () => {
    return (
        <div>
            <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Dropdown Menu</div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="bg-primary text-primary-foreground text-sm px-3 py-2 rounded-md font-medium">
                        Open Menu
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

const DemoBadge = () => {
    return (
        <div>
            <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Badge Variants</div>

            <div className="flex flex-wrap gap-3">
                <Badge color="green" size="small">Active</Badge>
                <Badge color="red" radius="medium">Error</Badge>
                <Badge color="yellow" size="full">Warning Message</Badge>
            </div>
        </div>
    );
};

const ButtonsDemo = () => {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6">
            <div className="mb-4"><h1 className="text-base font-medium">Buttons Demo</h1></div>
            <div>
                <h2 className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Variants</h2>
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
                <h2 className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Sizes</h2>
                <div className="flex flex-wrap gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" aria-label="Icon button">
                        <Plus />
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Full Width</h2>
                <Button fullWidth>Full Width Button</Button>
            </div>

            <div>
                <h2 className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">With Icons</h2>
                <div className="flex flex-wrap gap-3">
                    <Button leftIcon={<Plus />}>Add Item</Button>
                    <Button rightIcon={<Trash2 />}>Delete</Button>
                    <Button leftIcon={<Loader2 className="animate-spin" />} disabled>
                        Loading...
                    </Button>
                </div>
            </div>

            <div>
                <h2 className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">Loading State</h2>
                <Button
                    isLoading={loading}
                    onClick={() => {
                        setLoading(true);
                        setTimeout(() => setLoading(false), 1500);
                    }}
                >
                    Submit
                </Button>
            </div>
        </div>
    );
};

const TableDemo = () => {
  return (
    <div>
      <div className="ml-1 mb-2 text-sm text-muted-foreground font-semibold">
        Table Component
      </div>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>

        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell>#INV-001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>2025-07-16</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#INV-002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>$180.00</TableCell>
            <TableCell>2025-07-15</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>#INV-003</TableCell>
            <TableCell>Failed</TableCell>
            <TableCell>$320.00</TableCell>
            <TableCell>2025-07-14</TableCell>
          </TableRow>
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell colSpan={2}>
              $750.00
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

