import React, { useEffect, useState } from "react";
import "./profile.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";

const Profile = (name) => {
  const [loading, setLoading] = useState(true);
  const [perfilData, setPerfilData] = useState([]);
  const [isEditing, setIsEditing] = useState({
    telefono: false,
    correo: false,
    nombreUsuario: false,
  }); // Control de edición
  const [editableData, setEditableData] = useState({
    telefono: "",
    correo: "",
    nombreUsuario: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState({
    name: name.name,
  });

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
          nombreUsuario: response.data[0].nombreUsuario || "",
        });
        setLoading(false);
      } catch (error) {
        toast.error("Error al obtener los datos");
      }
    }

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData({
      ...editableData,
      [name]: value,
    });
  };

  const handleToggleEdit = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));

    if (isEditing[field]) {
      handleUpdate();
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToUpdate = {
        ...editableData,
        nombreUsuario: perfilData[0].nombreUsuario,
      };

      const response = await axios.post(
        "http://localhost:8081/actualizar_perfil",
        dataToUpdate
      );

      if (response.data.message) {
        toast.success("Perfil actualizado exitosamente");
        // Actualiza los datos locales
        setPerfilData((prevData) => {
          const newData = [...prevData];
          newData[0] = { ...newData[0], ...editableData };
          return newData;
        });
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error(
        error.response?.data?.error || "Error al actualizar el perfil"
      );
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!newPassword || !confirmPassword) {
      toast.error("Por favor complete ambos campos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/cambiar_contrasena",
        {
          newPassword,
          nombreUsuario: perfilData[0].nombreUsuario,
        }
      );

      if (response.data.message) {
        toast.success("Contraseña actualizada exitosamente");
        setShowModal(false);
        // Limpiar los campos
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.error || "Error al cambiar la contraseña"
        );
      } else if (error.request) {
        toast.error("Error de conexión con el servidor");
      }
      return;
    }
  };

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
                <p>
                  <strong>Nombre:</strong> {record.nombre || "No disponible"}
                </p>
                <p>
                  <strong>Apellido:</strong>{" "}
                  {record.apellido || "No disponible"}
                </p>

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
                      <FaCheck
                        className="check-icon"
                        onClick={() => handleToggleEdit("telefono")}
                      />{" "}
                      {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.telefono || "No disponible"}
                      <FaEdit
                        onClick={() => handleToggleEdit("telefono")}
                        className="edit-icon"
                      />{" "}
                      {/* Icono de edición */}
                    </>
                  )}
                </p>

                <p>
                  <strong>Número de Documento:</strong>{" "}
                  {record.numDocumento || "No disponible"}
                </p>

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
                      <FaCheck
                        className="check-icon"
                        onClick={() => handleToggleEdit("correo")}
                      />{" "}
                      {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.correo || "No disponible"}
                      <FaEdit
                        onClick={() => handleToggleEdit("correo")}
                        className="edit-icon"
                      />{" "}
                      {/* Icono de edición */}
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
                      <FaCheck
                        className="check-icon"
                        onClick={() => handleToggleEdit("nombreUsuario")}
                      />{" "}
                      {/* Icono de check */}
                    </>
                  ) : (
                    <>
                      {editableData.nombreUsuario || "No disponible"}
                      <FaEdit
                        onClick={() => handleToggleEdit("nombreUsuario")}
                        className="edit-icon"
                      />{" "}
                      {/* Icono de edición */}
                    </>
                  )}
                </p>
                <Link
                  to="#"
                  className="text-primary"
                  onClick={() => setShowModal(true)}
                >
                  Cambiar Contraseña
                </Link>
              </div>
            </div>

            <div className="profile-right">
              <div className="profile-section">
                <h4>Información de Vivienda</h4>
                <p>
                  <strong>Apartamento:</strong>{" "}
                  {record.Apartamento_FK || "No disponible"}
                </p>
                <p>
                  <strong>Meses Atrasados:</strong>{" "}
                  {record.mesesAtrasados || "0"}
                </p>
                <p>
                  <strong>ID Propietario:</strong>{" "}
                  {record.idPropietario || "No disponible"}
                </p>
              </div>
              <br />
              <br />
              <br />
              <div className="profile-section">
                <h4>Información de Vehículo</h4>
                <p>
                  <strong>Parqueadero:</strong>{" "}
                  {record.idParqueaderoFk || "No asignado"}
                </p>
                <p>
                  <strong>Placa Vehículo:</strong>{" "}
                  {record.placaVehiculo || "No registrado"}
                </p>
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
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      placeholder="Nueva contraseña"
                    />
                    <small className="form-text text-muted">
                      La contraseña debe contener al menos 8 caracteres, una
                      letra mayúscula y un número.
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      placeholder="Confirmar contraseña"
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handlePasswordChange}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
