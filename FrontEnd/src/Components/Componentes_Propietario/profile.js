import React, { useEffect, useState } from "react";
import { useUser } from "../../userContext";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import axios from "axios";

const Profile = () => {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perfilData, setPerfilData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8081/public")
      .then((res) => {
        if (res.data.Status === "Success") {
          setName(res.data.nombreUsuario);
        } else {
        }
      })
      .catch((err) => console.log(err));
  }, []);
  



  const fetchPerfilData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8081/vista_perfil?userId=${userId}`);
      if (!response.ok) throw new Error('Error al obtener los datos del perfil');
      const data = await response.json();
      if (data && data.length > 0) {
        setPerfilData(data[0]);
      } else {
        setError("No se encontraron datos del perfil");
      }
    } catch (error) {
      console.error(error);
      setError("Error al cargar los datos del perfil");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Mi Perfil</h1>
      
      <div className="profile-grid">
        <div className="profile-section">
          <h2>Información Personal</h2>
          <div className="profile-field">
            <span className="field-label">Nombre:</span>
            <span className="field-value">{perfilData?.nombre || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Apellido:</span>
            <span className="field-value">{perfilData?.apellido || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Teléfono:</span>
            <span className="field-value">{perfilData?.telefono || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Número de Documento:</span>
            <span className="field-value">{perfilData?.numDocumento || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Correo:</span>
            <span className="field-value">{perfilData?.correo || 'No disponible'}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Información de Acceso</h2>
          <div className="profile-field">
            <span className="field-label">Nombre de Usuario:</span>
            <span className="field-value">{perfilData?.nombreUsuario || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Contraseña:</span>
            <span className="field-value">********</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Información de Vivienda</h2>
          <div className="profile-field">
            <span className="field-label">Apartamento:</span>
            <span className="field-value">{perfilData?.Apartamento_FK || 'No disponible'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Meses Atrasados:</span>
            <span className="field-value">{perfilData?.mesesAtrasados || '0'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">ID Propietario:</span>
            <span className="field-value">{perfilData?.idPropietario || 'No disponible'}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Información de Vehículo</h2>
          <div className="profile-field">
            <span className="field-label">Parqueadero:</span>
            <span className="field-value">{perfilData?.idParqueaderoFk || 'No asignado'}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Placa Vehículo:</span>
            <span className="field-value">{perfilData?.placaVehiculo || 'No registrado'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;