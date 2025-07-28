import { useState } from "react"
import { Sidebar, SidebarProvider } from "./components/ui/sidebar"
import { Link, Outlet } from "react-router-dom";
import { Settings2, ReceiptText, PackageOpen, House, DotIcon, UserRound, Banknote, ChevronDown, NetworkIcon, NotebookPen, WarehouseIcon, Package, Monitor as MonitorIcon, LogOut as LogOutIcon, Bell as BellIcon, Search as SearchIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover";

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
            { label: "Chart of Accounts", icon: <NetworkIcon />, url: "/app/accounts/list" },
            { label: "Sales Invoice", icon: <ReceiptText />, url: "/app/invoices/list" },
            { label: "Journal Entry", icon: <NotebookPen />, url: "/app/journals/list" },
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
                                <Link to={child.url}>
                                    <div className="flex items-center gap-2 ">
                                        <div className="[&>svg]:size-5">{child.icon}</div>
                                        <div className="font-medium text-sm">{child.label}</div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
const AppSidebar = () => {

    const handleLogut = () => { }

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

const SearchBar = () => {
    return (
        <div className="flex items-center gap-2 border rounded-full px-4 py-2 shadow-sm w-80 focus-within:ring-2 ring-blue-500 ring-offset-2">
            <input type="text" placeholder="Search..." className="border-0 text-sm outline-none flex-1" />
            <SearchIcon className="size-5" />
        </div>
    )
}

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Invoice Paid",
            description: "Invoice #1234 has been paid.",
            read: false,
            time: "2m ago"
        },
        {
            id: 2,
            title: "New User Registered",
            description: "A new user has signed up.",
            read: false,
            time: "10m ago"
        },
        {
            id: 3,
            title: "Stock Alert",
            description: "Product ABC is low on stock.",
            read: true,
            time: "1h ago"
        }
    ]);

    const handleMarkAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true }))
        );
    };

    const hasUnread = notifications.some((n) => !n.read);

    return (
        <Popover>
            <PopoverTrigger>
                <div className="relative">
                    <BellIcon className="size-5" />
                    {hasUnread && (
                        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent style={{ width: "28rem" }} className="shadow-sm p-0">
                <div className="px-4">
                    <header className="flex items-center justify-between border-b py-2">
                        <div className="font-semibold">Your Notifications</div>
                        <button
                            className="text-blue-900 cursor-pointer text-sm disabled:text-gray-400"
                            onClick={handleMarkAllAsRead}
                            disabled={!hasUnread}
                        >
                            Mark all as read
                        </button>
                    </header>
                    <div className="py-2 max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="text-sm text-center py-8">No notifications</div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`flex items-start gap-3 py-3 rounded-md transition-colors ${n.read ? "" : "bg-blue-50"
                                        } mb-1`}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <DotIcon className={`size-5 ${n.read ? "" : "text-blue-500"}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-sm">{n.title}</div>
                                        <div className="text-xs text-gray-600">{n.description}</div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

const Header = () => {
    return (
        <header className="border-b">
            <div className="flex items-center justify-between px-4 py-2">
                <SearchBar />

                <div className="flex items-center justify-between gap-2">
                    <Notifications />
                    <UserRound className="size-5" />
                </div>
            </div>
        </header>
    )
}
export const Layout = () => {
    const [open, setOpen] = useState(true)

    return <>

        <SidebarProvider open={open} onOpenChange={setOpen}>
            <AppSidebar />

            <div className="flex-auto ">
                <Header />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>

        </SidebarProvider>
    </>
}