/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, createContext, useContext, useCallback } from "react";
import type React from "react";
import { Folder, FolderOpen, CheckCircle2, Dot as DotIcon } from "lucide-react";

import { formatCurrency } from "../../utils";

export interface TypeTreeNode {
    label: string;
    data?: Record<string, any>;
    description?: string;
    is_group?: boolean;
    children?: TypeTreeNode[];
    id: string; // Added unique identifier
}

interface TreeState {
    expandedNodes: Set<string>;
    selectedNodes: Set<string>;
}

interface TreeContextType {
    state: TreeState;
    toggleExpanded: (nodeId: string) => void;
    toggleSelected: (nodeId: string) => void;
    selectNode: (nodeId: string) => void;
    deselectNode: (nodeId: string) => void;
    clearSelection: () => void;
    isExpanded: (nodeId: string) => boolean;
    isSelected: (nodeId: string) => boolean;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

const useTreeContext = () => {
    const context = useContext(TreeContext);
    if (!context) {
        throw new Error('useTreeContext must be used within a TreeProvider');
    }
    return context;
};

// const tempData: TypeTreeNode[] = [
//     {
//         id: "assets-unityalgo",
//         label: "Assets - UnityAlgo",
//         data: {
//             account_code: "1000",
//             account_type: "Asset",
//             account_subtype: "Asset",
//             balance: 0,
//         },
//         description: "All assets owned by UnityAlgo",
//         is_group: true,
//         children: [
//             {
//                 id: "current-assets-unityalgo",
//                 label: "Current Assets - UnityAlgo",
//                 data: {
//                     account_code: "1100",
//                     account_type: "Asset",
//                     account_subtype: "Current Asset",
//                     balance: 0,
//                 },
//                 description: "Assets that can be converted to cash within one year",
//                 is_group: true,
//                 children: [
//                     {
//                         id: "cash-equivalents-unityalgo",
//                         label: "Cash and Cash Equivalents - UnityAlgo",
//                         data: {
//                             account_code: "1110",
//                             account_type: "Asset",
//                             account_subtype: "Current Asset",
//                             balance: 0,
//                         },
//                         description: "All cash accounts and equivalents",
//                         is_group: true,
//                         children: [
//                             {
//                                 id: "cash-operating-unityalgo",
//                                 label: "Cash - Operating Account - UnityAlgo",
//                                 data: {
//                                     account_code: "1111",
//                                     account_type: "Asset",
//                                     account_subtype: "Current Asset",
//                                     balance: 50000,
//                                 },
//                                 description: "Primary operating bank account",
//                                 is_group: false,
//                             },
//                             {
//                                 id: "cash-savings-unityalgo",
//                                 label: "Cash - Savings Account - UnityAlgo",
//                                 data: {
//                                     account_code: "1112",
//                                     account_type: "Asset",
//                                     account_subtype: "Current Asset",
//                                     balance: 25000,
//                                 },
//                                 description: "Business savings account",
//                                 is_group: false,
//                             },
//                             {
//                                 id: "petty-cash-unityalgo",
//                                 label: "Petty Cash - UnityAlgo",
//                                 data: {
//                                     account_code: "1113",
//                                     account_type: "Asset",
//                                     account_subtype: "Current Asset",
//                                     balance: 500,
//                                 },
//                                 description: "Small cash fund for minor expenses",
//                                 is_group: false,
//                             },
//                         ],
//                     },
//                     {
//                         id: "accounts-receivable-unityalgo",
//                         label: "Accounts Receivable - UnityAlgo",
//                         data: {
//                             account_code: "1120",
//                             account_type: "Asset",
//                             account_subtype: "Current Asset",
//                             balance: 12000,
//                         },
//                         description: "Amounts owed to UnityAlgo by customers",
//                         is_group: false,
//                     },
//                     {
//                         id: "inventory-unityalgo",
//                         label: "Inventory - UnityAlgo",
//                         data: {
//                             account_code: "1130",
//                             account_type: "Asset",
//                             account_subtype: "Current Asset",
//                             balance: 8000,
//                         },
//                         description: "Goods available for sale",
//                         is_group: false,
//                     },
//                     {
//                         id: "prepaid-expenses-unityalgo",
//                         label: "Prepaid Expenses - UnityAlgo",
//                         data: {
//                             account_code: "1140",
//                             account_type: "Asset",
//                             account_subtype: "Current Asset",
//                             balance: 2000,
//                         },
//                         description: "Expenses paid in advance",
//                         is_group: false,
//                     },
//                 ],
//             },
//             {
//                 id: "fixed-assets-unityalgo",
//                 label: "Fixed Assets - UnityAlgo",
//                 data: {
//                     account_code: "1200",
//                     account_type: "Asset",
//                     account_subtype: "Fixed Asset",
//                     balance: 0,
//                 },
//                 description: "Long-term assets owned by UnityAlgo",
//                 is_group: true,
//                 children: [
//                     {
//                         id: "property-unityalgo",
//                         label: "Property - UnityAlgo",
//                         data: {
//                             account_code: "1210",
//                             account_type: "Asset",
//                             account_subtype: "Fixed Asset",
//                             balance: 100000,
//                         },
//                         description: "Land and buildings owned",
//                         is_group: false,
//                     },
//                     {
//                         id: "equipment-unityalgo",
//                         label: "Equipment - UnityAlgo",
//                         data: {
//                             account_code: "1220",
//                             account_type: "Asset",
//                             account_subtype: "Fixed Asset",
//                             balance: 35000,
//                         },
//                         description: "Machinery and equipment",
//                         is_group: false,
//                     },
//                     {
//                         id: "vehicles-unityalgo",
//                         label: "Vehicles - UnityAlgo",
//                         data: {
//                             account_code: "1230",
//                             account_type: "Asset",
//                             account_subtype: "Fixed Asset",
//                             balance: 15000,
//                         },
//                         description: "Company vehicles",
//                         is_group: false,
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         id: "liabilities-unityalgo",
//         label: "Liabilities - UnityAlgo",
//         data: {
//             account_code: "2000",
//             account_type: "Liability",
//             account_subtype: "Liability",
//             balance: 0,
//         },
//         description: "All liabilities owed by UnityAlgo",
//         is_group: true,
//         children: [
//             {
//                 id: "current-liabilities-unityalgo",
//                 label: "Current Liabilities - UnityAlgo",
//                 data: {
//                     account_code: "2100",
//                     account_type: "Liability",
//                     account_subtype: "Current Liability",
//                     balance: 0,
//                 },
//                 description: "Liabilities due within one year",
//                 is_group: true,
//                 children: [
//                     {
//                         id: "accounts-payable-unityalgo",
//                         label: "Accounts Payable - UnityAlgo",
//                         data: {
//                             account_code: "2110",
//                             account_type: "Liability",
//                             account_subtype: "Current Liability",
//                             balance: 9000,
//                         },
//                         description: "Amounts owed to suppliers",
//                         is_group: false,
//                     },
//                     {
//                         id: "accrued-expenses-unityalgo",
//                         label: "Accrued Expenses - UnityAlgo",
//                         data: {
//                             account_code: "2120",
//                             account_type: "Liability",
//                             account_subtype: "Current Liability",
//                             balance: 3000,
//                         },
//                         description: "Expenses incurred but not yet paid",
//                         is_group: false,
//                     },
//                 ],
//             },
//             {
//                 id: "long-term-liabilities-unityalgo",
//                 label: "Long-term Liabilities - UnityAlgo",
//                 data: {
//                     account_code: "2200",
//                     account_type: "Liability",
//                     account_subtype: "Long-term Liability",
//                     balance: 0,
//                 },
//                 description: "Liabilities due after one year",
//                 is_group: true,
//                 children: [
//                     {
//                         id: "bank-loan-unityalgo",
//                         label: "Bank Loan - UnityAlgo",
//                         data: {
//                             account_code: "2210",
//                             account_type: "Liability",
//                             account_subtype: "Long-term Liability",
//                             balance: 40000,
//                         },
//                         description: "Long-term bank loan",
//                         is_group: false,
//                     },
//                 ],
//             },
//         ],
//     },
//     {
//         id: "equity-unityalgo",
//         label: "Equity - UnityAlgo",
//         data: {
//             account_code: "3000",
//             account_type: "Equity",
//             account_subtype: "Equity",
//             balance: 0,
//         },
//         description: "Owner's equity accounts",
//         is_group: true,
//         children: [
//             {
//                 id: "owner-capital-unityalgo",
//                 label: "Owner's Capital - UnityAlgo",
//                 data: {
//                     account_code: "3100",
//                     account_type: "Equity",
//                     account_subtype: "Equity",
//                     balance: 100000,
//                 },
//                 description: "Owner's investment in the business",
//                 is_group: false,
//             },
//             {
//                 id: "retained-earnings-unityalgo",
//                 label: "Retained Earnings - UnityAlgo",
//                 data: {
//                     account_code: "3200",
//                     account_type: "Equity",
//                     account_subtype: "Equity",
//                     balance: 20000,
//                 },
//                 description: "Cumulative net income retained in the business",
//                 is_group: false,
//             },
//         ],
//     },
// ];

const TreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<TreeState>({
        expandedNodes: new Set(['assets-unityalgo', 'current-assets-unityalgo', 'cash-equivalents-unityalgo']),
        selectedNodes: new Set(),
    });

    const toggleExpanded = useCallback((nodeId: string) => {
        setState(prev => {
            const newExpanded = new Set(prev.expandedNodes);
            if (newExpanded.has(nodeId)) {
                newExpanded.delete(nodeId);
            } else {
                newExpanded.add(nodeId);
            }
            return { ...prev, expandedNodes: newExpanded };
        });
    }, []);

    const toggleSelected = useCallback((nodeId: string) => {
        setState(prev => {
            const newSelected = new Set(prev.selectedNodes);
            if (newSelected.has(nodeId)) {
                newSelected.delete(nodeId);
            } else {
                newSelected.add(nodeId);
            }
            return { ...prev, selectedNodes: newSelected };
        });
    }, []);

    const selectNode = useCallback((nodeId: string) => {
        setState(prev => {
            const newSelected = new Set(prev.selectedNodes);
            newSelected.add(nodeId);
            return { ...prev, selectedNodes: newSelected };
        });
    }, []);

    const deselectNode = useCallback((nodeId: string) => {
        setState(prev => {
            const newSelected = new Set(prev.selectedNodes);
            newSelected.delete(nodeId);
            return { ...prev, selectedNodes: newSelected };
        });
    }, []);

    const clearSelection = useCallback(() => {
        setState(prev => ({ ...prev, selectedNodes: new Set() }));
    }, []);

    const isExpanded = useCallback((nodeId: string) => {
        return state.expandedNodes.has(nodeId);
    }, [state.expandedNodes]);

    const isSelected = useCallback((nodeId: string) => {
        return state.selectedNodes.has(nodeId);
    }, [state.selectedNodes]);

    const contextValue: TreeContextType = {
        state,
        toggleExpanded,
        toggleSelected,
        selectNode,
        deselectNode,
        clearSelection,
        isExpanded,
        isSelected,
    };

    return (
        <TreeContext.Provider value={contextValue}>
            {children}
        </TreeContext.Provider>
    );
};

const TreeNode = ({ node }: { node: TypeTreeNode }) => {
    const { toggleExpanded, isExpanded, isSelected } = useTreeContext();

    const expanded = isExpanded(node.id);
    const selected = isSelected(node.id);

    const handleExpandClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (node.is_group) {
            toggleExpanded(node.id);
        }
    };

    const handleNodeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // toggleSelected(node.id);
    };

    return (
        <div className="select-none">
            <div
                className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 transition-colors ${selected ? 'bg-blue-100 border border-blue-300' : ''
                    }`}
                onClick={handleNodeClick}
            >
                <div
                    className="flex items-center justify-center w-5 h-5 cursor-pointer hover:bg-gray-200 rounded"
                    onClick={handleExpandClick}
                >
                    {node.is_group && !expanded && <Folder className="size-5" />}
                    {node.is_group && expanded && <FolderOpen className="size-5" />}
                    {!node.is_group && <DotIcon className="size-6" />}
                </div>

                <div className="flex-1 flex items-center gap-2">
                    <span className={`${selected ? 'font-medium text-blue-800' : 'text-gray-700'}`}>
                        {node.label}
                    </span>
                    {selected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>

                {node.data?.balance !== undefined && (
                    <span className="text-sm text-gray-500 font-mono">
                        {formatCurrency(node.data.balance)}
                    </span>
                )}
            </div>

            {node.description && selected && (
                <div className="ml-7 mt-1 mb-2 p-2 bg-gray-50 rounded text-sm text-gray-600 border-l-2 border-blue-300">
                    {node.description}
                    {node.data && (
                        <div className="mt-1 text-xs text-gray-500">
                            Code: {node.data.account_code} | Type: {node.data.account_subtype}
                        </div>
                    )}
                </div>
            )}

            {node.is_group && expanded && node.children && (
                <div className="ml-4 border-l border-gray-200 transition-all duration-200">
                    {node.children.map((child) => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
};

interface TreeViewProps {
    data?: TypeTreeNode[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
    return (
        <TreeProvider>
            <div className="p-4 bg-white">
                <div className="mb-4 flex gap-2">
                    <TreeControls />
                </div>
                <div className="border border-gray-200 rounded-md p-4">
                    {data.map((node) => (
                        <TreeNode key={node.id} node={node} />
                    ))}
                </div>
                <SelectedNodesDisplay />
            </div>
        </TreeProvider>
    );
};

const TreeControls: React.FC = () => {
    const { clearSelection, state } = useTreeContext();

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={clearSelection}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm transition-colors"
                disabled={state.selectedNodes.size === 0}
            >
                Clear Selection ({state.selectedNodes.size})
            </button>
        </div>
    );
};

const SelectedNodesDisplay: React.FC = () => {
    const { state } = useTreeContext();

    if (state.selectedNodes.size === 0) return null;

    return (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">
                Selected Nodes ({state.selectedNodes.size})
            </h3>
            <div className="text-sm text-blue-700">
                {Array.from(state.selectedNodes).join(', ')}
            </div>
        </div>
    );
};

export { TreeView };