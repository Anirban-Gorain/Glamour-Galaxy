import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import CustomerRoutes from "./Routes/CustomerRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<CustomerRoutes />}></Route>
          {/* Admin */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
