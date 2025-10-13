import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./functionalities/LoginForm";
import RecoveryForm from "./functionalities/RecoveryForm";
import MiHorario from "./functionalities/Profesor/MiHorario.jsx";

// Admin
import AdminLayout from "./functionalities/Administrador/AdminLayout.jsx";
import AdminDashboard from "./functionalities/Administrador/Dashboard.jsx";
import Docentes from "./functionalities/Administrador/Docentes.jsx";
import Materias from "./functionalities/Administrador/Materias.jsx";
import PlanesEstudio from "./functionalities/Administrador/PlanesEstudio.jsx";
import Lugares from "./functionalities/Administrador/Lugares.jsx";
import Horarios from "./functionalities/Administrador/Horarios.jsx";
import Solicitudes from "./functionalities/Administrador/Solicitudes.jsx";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/recovery" element={<RecoveryForm />} />

        {/* Profesor */}
        <Route path="/profesor/mi-horario" element={<MiHorario />} />

        {/* Admin con layout + sidebar */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* redirige /admin a /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="docentes" element={<Docentes />} />
          <Route path="materias" element={<Materias />} />
          <Route path="planes" element={<PlanesEstudio />} />
          <Route path="lugares" element={<Lugares />} />
          <Route path="horarios" element={<Horarios />} />
          <Route path="solicitudes" element={<Solicitudes />} /> 
        </Route>

        {/* si alguien entra a ruta vieja */}
        <Route
          path="/admin/admin-dashboard"
          element={<Navigate to="/admin/dashboard" replace />}
        />

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Ruta no encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
