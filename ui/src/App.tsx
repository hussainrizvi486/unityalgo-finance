import React from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, useRoutes, Routes, Route } from 'react-router-dom';
import { routes } from './features/point-of-sale/routes';
import { routes as accountsRoutes } from './features/accounting/routes';


const POS = () => {
  return useRoutes(routes);
}

const Accounting = () => {
  return useRoutes(accountsRoutes);
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <POS />
      {/* <Accounting /> */}
    </BrowserRouter>
  );
}

export default App;