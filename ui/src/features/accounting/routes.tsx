
import * as React from "react";
import type { RouteObject } from "react-router-dom";

const ChartOfAccounts = React.lazy(() => import("./pages/accounts/list"));

import { Layout } from "./../../layout";
export const routes: RouteObject[] = [

    {
        path: "/app",
        element: <Layout />,
        children: [
            { path: "/accounts/list", element: <ChartOfAccounts /> },
        ]
    },
]