
import * as React from "react";
import type { RouteObject } from "react-router-dom";

const PointOfSale = React.lazy(() => import("./pages/index"));
const Invoices = React.lazy(() => import("./pages/invoice/index"));

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
            { path: "invoices", element: <Invoices /> },
        ]
    },
    // {
    //     path: "/admin/invoices",
    //     element: <Invoices />
    // }
]