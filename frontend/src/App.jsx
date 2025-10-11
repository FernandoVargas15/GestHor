import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./functionalities/LoginForm";
import RecoveryForm from "./functionalities/RecoveryForm";
import MiHorario from "./functionalities/Profesor/MiHorario.jsx";
import AdminDashboard from "./functionalities/Administrador/Dashboard.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Login" element={<LoginForm />} />     
        <Route path="/Recovery" element={<RecoveryForm />} />
        
        {/* Profesor */}
        <Route path="/profesor/mi-horario" element={<MiHorario />} />

        {/* Admin */}
        <Route path="/admin/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
