import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoComponent } from "./demo/component"


const PointOfSale = React.lazy(() => import('./features/point-of-sale/pages/index'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo" element={<DemoComponent />} />

        <Route path="/pos" element={<PointOfSale />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;