import { useState } from "react"
import { Sidebar, SidebarProvider } from "./components/ui/sidebar"
import { Link, Outlet } from "react-router-dom";
import { Settings2, ReceiptText, PackageOpen, House, DotIcon, UserRound, BellDot, Banknote, ChevronDown } from "lucide-react";
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
            { label: "List", icon: <UserRound />, url: "/admin/accounts/list" },
            { label: "Create", icon: <UserRound />, url: "/admin/accounts/create" }
        ]
    },
    // { label: "Products", icon: <PackageOpen />, url: "/admin/products/liBanknotest" },
    { label: "Orders", icon: <ReceiptText />, url: "/admin/orders/list" },
    // { label: "Customers", icon: <DotIcon />, url: "" },
    // { label: "Discounts", icon: <DotIcon />, url: "" },
    // { label: "Analytics", icon: <DotIcon />, url: "" },
    // { label: "Settings", icon: <Settings2 />, url: "" }
]



const Brand = () => {
    return (<div className="flex items-center gap-2">
        <img src="/logo.png" alt="" className="h-10 w-10" />
        <div className="font-bold text-lg">UnityAlgo</div>
    </div>
    )
}

const AppSidebar = () => {
    return (
        <Sidebar >
            <div className="py-4 px-2">
                <div className="mb-6">
                    <Brand />
                </div>

                <ul >
                    {items.map((item, index) => (
                        <div key={index} className="mb-2 hover:bg-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">{item.label}</div>
                                <ChevronDown className="size-5" />
                            </div>

                            <div>

                            </div>
                        </div>


                        // <Link to={item.url || ""} key={index}>
                        //     <li>
                        //         <div

                        //             className={cn("flex items-center gap-2 w-full px-2 py-1 text-left rounded-md hover:bg-gray-100 transition-all", isActiveURL(item.url) ? "bg-gray-100" : "")}
                        //         >
                        //             <div className="[&_*]:size-5 [&_*]:stroke-gray-700">
                        //                 {item.icon}
                        //             </div>
                        //             <div className="font-medium">{item.label}</div>
                        //         </div>
                        //     </li>
                        // </Link>
                    ))}
                </ul>
            </div>
        </Sidebar>
    )
}

export const Layout = () => {
    const [open, setOpen] = useState(true)

    return <>

        <SidebarProvider open={open} onOpenChange={setOpen}>
            <AppSidebar />

            <div className="flex-auto">
                <Outlet />
                {/* <div className="px-4">
                </div> */}
            </div>

        </SidebarProvider>
    </>
}