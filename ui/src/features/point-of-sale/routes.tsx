
import * as React from "react";
import type { RouteObject } from "react-router-dom";

const PointOfSale = React.lazy(() => import("./pages/index"));
const Invoices = React.lazy(() => import("./pages/invoice/index"));
const InvoiceForm = React.lazy(() => import("./pages/invoice/form"));

const ChartOfAccounts = React.lazy(() => import("@/features/accounting/pages/accounts/list"));
const AddAccount = React.lazy(() => import("@/features/accounting/pages/accounts/form"));

import { Layout } from "./../../layout";
export const routes: RouteObject[] = [
    {
        path: "/pos",
        element: <PointOfSale />
        // children: [
        //     {  },
        //     { path: "invoices/list", element: <Invoices /> },
        //     // { path: "orders/list", element: <OrderList /> },
        //     // { path: "product/create", element: <ProductForm /> },
        //     // { path: "product/:id", element: <ProductForm /> },
        //     // { path: "order/create", element: <OrderForm /> },
        // ]
    },
    {
        path: "/app",
        element: <Layout />,
        children: [
            { path: "invoice/list", element: <Invoices /> },
            { path: "invoice/new", element: <InvoiceForm /> },
            { path: "invoice/:id", element: <InvoiceForm /> },
            { path: "accounts/list", element: <ChartOfAccounts /> },
            { path: "accounts/form/new", element: <AddAccount /> },
        ]
    },
    // {
    //     path: "/admin/invoices",
    //     element: <Invoices />
    // }
]