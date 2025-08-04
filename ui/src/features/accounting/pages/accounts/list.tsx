import { TreeView } from "@/components/treeview/index";
import { useQuery } from "@tanstack/react-query";
import { SERVER_URL } from "../../../../api";
import axios from "axios";
import { Button } from "../../../../components/ui/button";
import { Link } from "react-router-dom";

export interface TypeTreeNode {
    label: string;
    data?: Record<string, any>;
    description?: string;
    is_group?: boolean;
    children?: TypeTreeNode[];
    id: string; // Added unique identifier
}

const transformToTreeNode = (account: AccountQueryResponse): TypeTreeNode => ({
    label: `${account.account_number} - ${account.account_name}`,
    data: {
        type: account.account_type,
        company: account.company,
        frozen: account.frozen,
    },
    is_group: account.is_group,
    id: account.id,
    children: account.childrens?.map(transformToTreeNode),
});

interface AccountQueryResponse {
    account_number: string
    account_name: string
    account_type: string
    id: string
    company: string
    frozen: boolean
    is_group: boolean
    childrens: AccountQueryResponse[]
}
const useAccountsQuery = () => useQuery({
    queryKey: ["chart-of-accounts"],
    queryFn: async () => {
        const response = await axios.get<AccountQueryResponse[]>(SERVER_URL + "/api/account/tree");
        return response.data.map(transformToTreeNode);
    },
})

const Index = () => {
    const { data: accountsData, isLoading } = useAccountsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">

                <div className="font-semibold text-lg">
                    Chart of Accounts
                </div>

                <Link to="/app/accounts/form/new">
                    <Button>Add Account</Button>
                </Link>
            </div>
            <div>
                <TreeView data={accountsData} />
            </div>
        </div>
    )
}

export default Index;