import React from "react";
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, useRoutes, Routes, Route } from 'react-router-dom';
import { routes } from './features/point-of-sale/routes';


const POS = () => {
  return useRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <POS />
    </BrowserRouter>
  );
}

export default App;