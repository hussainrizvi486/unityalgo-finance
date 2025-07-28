import { Folder as FolderIcon, FolderOpen as FolderOpenIcon } from "lucide-react";
import { useState } from "react";
import { TreeView } from "@/components/treeview/index";

const Index = () => {
    return (
        <div>
            <div className="font-semibold text-lg">
                Chart of Accounts
            </div>
            <div>
                <TreeView />
            </div>
        </div>
    )
}

export default Index;