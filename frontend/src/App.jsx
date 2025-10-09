import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginForm from "./functionalities/LoginForm";
import RecoveryForm from "./functionalities/RecoveryForm";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />} />         {/* Ruta raíz */}
        <Route path="/Login" element={<LoginForm />} />    {/* Ruta /login */}
        <Route path="/Recovery" element={<RecoveryForm />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;