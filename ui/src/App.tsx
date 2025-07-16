import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DemoComponent } from "./demo/component"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/demo" element={<DemoComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;