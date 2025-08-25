import React from "react";
import { Demo as Index } from "./components/table-input/grid-form"
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, useRoutes, Routes, Route } from 'react-router-dom';
import { routes } from './features/point-of-sale/routes';
import { routes as accountsRoutes } from './features/accounting/routes';
import { DemoComponent } from "./demo/component";


const POS = () => {
  return useRoutes(routes);
}

const Accounting = () => {
  return useRoutes(accountsRoutes);
}



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="app/demo" element={<DemoComponent />} />
      </Routes>
      <Toaster />
      <POS />
      {/* <Accounting /> */}
    </BrowserRouter>
  );
}

export default App;