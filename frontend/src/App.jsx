// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./functionalities/LoginForm.jsx";
import MiHorario from "./functionalities/Profesor/MiHorario.jsx"; 
import AdminDashboard from "./functionalities/Administrador/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        {/* Profesor */}
        <Route path="/profesor/mi-horario" element={<MiHorario />} />
        {/* Admin */}
        <Route path="/admin/admin-dashboard" element={<AdminDashboard />} /> 
      </Routes>
    </BrowserRouter>
  );
}
