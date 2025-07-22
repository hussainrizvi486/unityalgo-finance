
import * as React from "react";
import type { RouteObject } from "react-router-dom";

const PointOfSale = React.lazy(() => import("./pages/index"));
const Invoices = React.lazy(() => import("./pages/invoice/index"));

const Layout = () => (<div></div>)

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
        path: "/pos/invoices",
        element: <Invoices />
    }
]