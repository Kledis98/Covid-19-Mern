import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LogIn from "./components/LogIn/Login";
import "./App.css";
import "leaflet/dist/leaflet.css";
import "bootstrap/dist/css/bootstrap.css";
import AdminPanel from "./pages/AdminDashboard/AdminPanel";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
