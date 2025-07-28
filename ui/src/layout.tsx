import { use, useState } from "react"
import { Sidebar, SidebarProvider } from "./components/ui/sidebar"
import { Link, Outlet } from "react-router-dom";
import { Settings2, ReceiptText, PackageOpen, House, DotIcon, UserRound, BellDot, Banknote, ChevronDown, NetworkIcon, NotebookPen, WarehouseIcon, Package, Monitor as MonitorIcon, LogOut as LogOutIcon } from "lucide-react";
import { cn, isActiveURL } from "./utils/index";

interface TypeSideBarItem {
    label: string;
    icon: React.ReactNode;
    url?: string;
    children?: TypeSideBarItem[];
}

const items: TypeSideBarItem[] = [
    { label: "Home", icon: <House />, url: "/admin" },
    {
        label: "Accounts", icon: <Banknote />, children: [
            { label: "Chart of Accounts", icon: <NetworkIcon />, url: "/admin/accounts/list" },
            { label: "Sales Invoice", icon: <ReceiptText />, url: "/admin/invoices/list" },
            { label: "Journal Entry", icon: <NotebookPen />, url: "/admin/journals/list" },
        ]
    },
    {

        label: "Stock", icon: <Package />, children: [
            { label: "Warehouse", icon: <WarehouseIcon />, url: "/admin/warehouse/list" },
            { label: "Products", icon: <PackageOpen />, url: "/admin/products/list" },
            { label: "Stock Entry", icon: <ReceiptText />, url: "/admin/stock-entry/list" },
        ]
    },
    {
        label: "Point of Sale", icon: <MonitorIcon />,
        children: [
            { label: "Invoices", icon: <ReceiptText />, url: "/app/invoices" },
            { label: "POS Profiles", icon: <UserRound />, url: "/app/profiles" },
            { label: "Open POS", icon: <DotIcon />, url: "/app/open-pos" },
        ]
    },
    { label: "Settings", icon: <Settings2 />, url: "" }
]



const Brand = () => {
    return (<div className="flex items-center gap-2">
        <img src="/logo.png" alt="" className="h-10 w-10" />
        <div className="font-bold text-lg">UnityAlgo</div>
    </div>
    )
}


const SidebarItem = ({ item }: { item: TypeSideBarItem }) => {
    const [open, setOpen] = useState(false);

    const toggleChildren = () => {
        if (!item.children?.length) return;

        setOpen((prev) => {
            console.log(prev);
            return !prev
        });
    }

    return (
        <div >
            <div className="flex items-center justify-between hover:bg-white transition-colors duration-150 cursor-pointer px-2 py-2 rounded-md"
                onClick={() => toggleChildren()}
            >
                <div className="flex items-center gap-2" >
                    <div className="[&>svg]:size-5">{item.icon}</div>
                    <div className="font-semibold text-sm">{item.label}</div>
                </div>
                {item.children && item.children.length > 0 && <ChevronDown className="size-5 cursor-pointer" />}
            </div>

            {open && item.children && item.children.length > 0 && (
                <div>
                    {item.children.map((child, childIndex) => (
                        <div key={childIndex} className="pl-4 cursor-pointer hover:bg-white transition-colors duration-150">
                            <div className="justify-between px-2 py-2 ">
                                <div className="flex items-center gap-2 ">
                                    <div className="[&>svg]:size-5">{child.icon}</div>
                                    <div className="font-medium text-sm">{child.label}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
const AppSidebar = () => {
    const handleLogut = () => {

    }
    return (
        <Sidebar >
            <div className="py-4 px-2">
                <div className="mb-6">
                    <Brand />
                </div>
                <ul>
                    {items.map((item, index) => (
                        <SidebarItem key={index} item={item} />
                    ))}
                </ul>


            </div>
            <div className="absolute bottom-10 left-0 w-full">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-white transition-colors duration-150 px-2 py-2 rounded-md"
                    onClick={handleLogut}
                >
                    <LogOutIcon />
                    <div className="font-semibold text-sm">Logout</div>
                </div>
            </div>
        </Sidebar>
    )
}

export const Layout = () => {
    const [open, setOpen] = useState(true)

    return <>

        <SidebarProvider open={open} onOpenChange={setOpen}>
            <AppSidebar />

            <div className="flex-auto px-4">
                <Outlet />
            </div>

        </SidebarProvider>
    </>
}