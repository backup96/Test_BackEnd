import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; 
import { Link } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa"; // Iconos para editar y guardar

const Profile = (name) => {
  const [loading, setLoading] = useState(true);
  const [perfilData, setPerfilData] = useState([]);
  const [isEditing, setIsEditing] = useState({ telefono: false, correo: false, nombreUsuario: false }); // Control de edición
  const [editableData, setEditableData] = useState({ telefono: "", correo: "", nombreUsuario: "" });
  const [showModal, setShowModal] = useState(false);
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
        setEditableData({
          telefono: response.data[0].telefono || "",
          correo: response.data[0].correo || "",
          nombreUsuario: response.data[0].nombreUsuario || ""
        });
        setLoading(false);
      } catch (error) {
        toast.error("Error al obtener los datos");
      }
    }

    fetchProfile();
  }, []);

  // const fetchPerfilData = async (userId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8081/vista_perfil?userId=${userId}`);
  //     if (!response.ok) throw new Error('Error al obtener los datos del perfil');
  //     const data = await response.json();
  //     if (data && data.length > 0) {
  //       setPerfilData(data[0]);
  //     } else {
  //       setError("No se encontraron datos del perfil");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setError("Error al cargar los datos del perfil");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer />
      <h1 className="profile-title">Mi Perfil</h1>
      <div className="profile-grid">
        {perfilData.map((record, index) => (
          <div key={index} className="profile-columns">
            <div className="profile-left">
              <div className="profile-section">
                <h4>Información Personal</h4>
                <p><strong>Nombre:</strong> {record.nombre || "No disponible"}</p>
                <p><strong>Apellido:</strong> {record.apellido || "No disponible"}</p>

                <p>
                  <strong>Teléfono:</strong>
                  {isEditing.telefono ? (
                    <>
                      <input
                        type="text"
                        name="telefono"
                        value={editableData.telefono}
                        onChange={handleInputChange}
                        onBlur={() => handleToggleEdit("telefono")} // Deja de editar al perder foco
                        autoFocus
                      />
                      <FaCheck className="check-icon" onClick={() => handleToggleEdit("telefono")} /> {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.telefono || "No disponible"}
                      <FaEdit onClick={() => handleToggleEdit("telefono")} className="edit-icon" /> {/* Icono de edición */}
                    </>
                  )}
                </p>

                <p><strong>Número de Documento:</strong> {record.numDocumento || "No disponible"}</p>

                <p>
                  <strong>Correo:</strong>
                  {isEditing.correo ? (
                    <>
                      <input
                        type="email"
                        name="correo"
                        value={editableData.correo}
                        onChange={handleInputChange}
                        onBlur={() => handleToggleEdit("correo")} // Deja de editar al perder foco
                        autoFocus
                      />
                      <FaCheck className="check-icon" onClick={() => handleToggleEdit("correo")} /> {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.correo || "No disponible"}
                      <FaEdit onClick={() => handleToggleEdit("correo")} className="edit-icon" /> {/* Icono de edición */}
                    </>
                  )}
                </p>
              </div>

              <div className="profile-section">
                <h4>Información de Acceso</h4>
                <p>
                  <strong>Nombre de Usuario:</strong>
                  {isEditing.nombreUsuario ? (
                    <>
                      <input
                        type="text"
                        name="nombreUsuario"
                        value={editableData.nombreUsuario}
                        onChange={handleInputChange}
                        onBlur={() => handleToggleEdit("nombreUsuario")} // Deja de editar al perder foco
                        autoFocus
                      />
                      <FaCheck className="check-icon" onClick={() => handleToggleEdit("nombreUsuario")} /> {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.nombreUsuario || "No disponible"}
                      <FaEdit onClick={() => handleToggleEdit("nombreUsuario")} className="edit-icon" /> {/* Icono de edición */}
                    </>
                  )}
                </p>
                <Link to="#" className="text-primary" onClick={() => setShowModal(true)}>
                  Cambiar Contraseña
                </Link>
              </div>
            </div>

            <div className="profile-right">
              <div className="profile-section">
                <h4>Información de Vivienda</h4>
                <p><strong>Apartamento:</strong> {record.Apartamento_FK || "No disponible"}</p>
                <p><strong>Meses Atrasados:</strong> {record.mesesAtrasados || "0"}</p>
                <p><strong>ID Propietario:</strong> {record.idPropietario || "No disponible"}</p>
              </div>
              {/* <div className="profile-field">
            <span className="field-label">Contraseña:</span>
            <span className="field-value">********</span>
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
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Contraseña</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <input type="password" className="form-control" id="newPassword" placeholder="Nueva contraseña" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                    <input type="password" className="form-control" id="confirmPassword" placeholder="Confirmar contraseña" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={handlePasswordChange}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
