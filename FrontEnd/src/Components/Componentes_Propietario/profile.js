import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Profile = (name) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perfilData, setPerfilData] = useState([]);
  const [values, setValues] = useState({
    name: name.name,
  });

  const [obj, setobj] = ({
    Pass: "",
    RecPass: "",
    nom: ""
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await axios.post(
          "http://localhost:8081/vista_perfil",
          values
        );
        setPerfilData(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Error al obtener los datos");
      }
    }

    fetchProfile();
  }, []);

  if (loading === "true") {
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
      <ToastContainer />
      <h1 className="profile-title">Mi Perfil</h1>
      <div className="profile-grid">
        {perfilData.map((record, index) => (
          <>
            <div className="profile-section">
              <h2>Información Personal</h2>
              <div className="profile-field">
                <span className="field-label">Nombre: </span>
                <span key={index} className="field-value">
                  {record.nombre || "No disponible"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Apellido: </span>
                <span key={index} className="field-value">
                  {record.apellido || "No disponible"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Teléfono: </span>
                <span key={index} className="field-value">
                  {record.telefono || "No disponible"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Número de Documento: </span>
                <span key={index} className="field-value">
                  {record.numDocumento || "No disponible"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Correo: </span>
                <span key={index} className="field-value">
                  {record.correo || "No disponible"}
                </span>
              </div>
            </div>

            <div className="profile-section">
              <h2>Información de Acceso</h2>
              <div className="profile-field">
                <span className="field-label">Nombre de Usuario:</span>
                <span key={index} className="field-value">
                  {record.nombreUsuario || "No disponible"}
                </span>
              </div>
              {/* <div className="profile-field">
            <span className="field-label">Contraseña:</span>
            <span className="field-value"> {record.numDoc || "No disponible"}</span>
          </div> */}
            </div>

            <div className="profile-section">
              <h2>Información de Vivienda</h2>
              <div className="profile-field">
                <span className="field-label">Apartamento:</span>
                <span key={index} className="field-value">
                  {record.Apartamento_FK || "No disponible"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Meses Atrasados:</span>
                <span key={index} className="field-value">
                  {record.mesesAtrasados || "0"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">ID Propietario:</span>
                <span key={index} className="field-value">
                  {record.idPropietario || "No disponible"}
                </span>
              </div>
            </div>

            <div className="profile-section">
              <h2>Información de Vehículo</h2>
              <div className="profile-field">
                <span className="field-label">Parqueadero:</span>
                <span key={index} className="field-value">
                  {record.idParqueaderoFk || "No asignado"}
                </span>
              </div>
              <div className="profile-field">
                <span className="field-label">Placa Vehículo:</span>
                <span key={index} className="field-value">
                  {record.placaVehiculo || "No registrado"}
                </span>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Profile;
