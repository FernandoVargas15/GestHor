import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/RecoveryForm.css';

const RecoveryForm = () => {
  
  const [formData, setFormData] = useState({
    userMatricula: '',
    registeredEmail: '',
    requestReason: '',
  });

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log('Solicitud enviada:', formData);
    
    alert('Solicitud de recuperación enviada. Revisa la consola para ver los datos.');
    
  };

  return (
    <div className="recovery-container">
      {/* Columna de Información Lateral */}
      <div className="info-column">
        <h1 className="system-title">SISTEMA DE HORARIOS</h1>
        <p className="system-subtitle">Gestión escolar · UNACH</p>
        <p className="recovery-info">
          Solicite la recuperación de su contraseña. El administrador dará respuesta en un máximo de 24 horas hábiles.
        </p>
      </div>

      {/* Tarjeta del Formulario */}
      <div className="form-card-wrapper">
        <div className="form-card">
          <h2 className="card-title">Recuperar Contraseña</h2>
          <p className="card-subtitle">Complete los siguientes campos para enviar su solicitud</p>

          <form onSubmit={handleSubmit} className="recovery-form">
            {/* Campo: Tu Usuario/Matrícula */}
            <div className="form-group">
              <label htmlFor="userMatricula">Tu Usuario/Matrícula</label>
              <input
                type="text"
                id="userMatricula"
                name="userMatricula"
                value={formData.userMatricula}
                onChange={handleChange}
                placeholder="Ingrese su usuario o matrícula"
                required
              />
            </div>

            {/* Campo: Correo Electrónico Registrado */}
            <div className="form-group">
              <label htmlFor="registeredEmail">Correo Electrónico Registrado</label>
              <input
                type="email"
                id="registeredEmail"
                name="registeredEmail"
                value={formData.registeredEmail}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            {/* Campo: Motivo de la solicitud */}
            <div className="form-group">
              <label htmlFor="requestReason">Motivo de la solicitud</label>
              <textarea
                id="requestReason"
                name="requestReason"
                value={formData.requestReason}
                onChange={handleChange}
                placeholder="Explique brevemente por qué necesita recuperar su contraseña"
                rows="3" // Ajusta la altura
                required
              ></textarea>
            </div>

            {/* Mensaje Importante */}
            <p className="important-note">
              Importante: Su solicitud será enviada al administrador del sistema. Recibirá una respuesta en un plazo máximo de 24 horas hábiles.
            </p>

            {/* Botón de Enviar */}
            <button type="submit" className="submit-button">
              Enviar solicitud
            </button>
          </form>

          {/* Enlace de Volver */}
          <div className="back-link-container">
            <Link to="/login" className="back-link">
              &lt; Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecoveryForm;