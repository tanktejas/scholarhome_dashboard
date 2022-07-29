import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./component/dash";

import { useEffect } from "react";
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  useEffect(() => {
    localStorage.setItem("mode", "dark");
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/:adminid" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
