import React, { useEffect, useState } from "react";
import { useUser } from "../../userContext";
import { FaEdit, FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import "./profile.css";

const Profile = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [isEditingTelefono, setIsEditingTelefono] = useState(false);
  const [isEditingCorreo, setIsEditingCorreo] = useState(false);
  const [isEditingPass, setIsEditingPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [updatedFields, setUpdatedFields] = useState({
    telefono: false,
    correo: false,
    pass: false
  });

  useEffect(() => {
    if (user) {
      setTelefono(user.Teléfono);
      setCorreo(user.Correo);
      setPass(user.Pass);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  const handleEditClick = (field) => {
    switch (field) {
      case "telefono":
        setIsEditingTelefono(true);
        setUpdatedFields(prev => ({ ...prev, telefono: true }));
        break;
      case "correo":
        setIsEditingCorreo(true);
        setUpdatedFields(prev => ({ ...prev, correo: true }));
        break;
      case "pass":
        setIsEditingPass(true);
        setUpdatedFields(prev => ({ ...prev, pass: true }));
        break;
    }
  };

  const validateTelefono = (telefono) => {
    const telefonoRegex = /^[0-9]{10}$/;
    return telefonoRegex.test(telefono);
  };

  const validateCorreo = (correo) => {
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return correoRegex.test(correo);
  };

  const validatePass = (pass) => {
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passRegex.test(pass);
  };

  const handleSaveClick = async (field) => {
    let isValid = true;

    if (field === "telefono" && !validateTelefono(telefono)) {
      setAlertMessage("El teléfono debe contener solo números y tener 10 caracteres.");
      setShowAlert(true);
      isValid = false;
    }

    if (field === "correo" && !validateCorreo(correo)) {
      setAlertMessage("El correo debe ser una dirección válida.");
      setShowAlert(true);
      isValid = false;
    }

    if (field === "pass" && !validatePass(pass)) {
      setAlertMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
      setShowAlert(true);
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch(
        `http://localhost:4000/Propietarios/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Teléfono: telefono,
            Correo: correo,
            Pass: pass,
          }),
        }
      );

      if (response.ok) {
        setAlertMessage("Datos actualizados correctamente.");
        setShowAlert(true);
        setIsEditingTelefono(false);
        setIsEditingCorreo(false);
        setIsEditingPass(false);
        setUpdatedFields(prev => ({ ...prev, [field]: true }));
      } else {
        setAlertMessage("Error al actualizar los datos.");
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      setAlertMessage("Error al actualizar los datos.");
      setShowAlert(true);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <p>Cargando...</p>
      </div>
    );
  }

  const espacioMoto = user.espacioMoto || 0;
  const espacioCarro = user.espacioCarro || 0;

  return (
    <>
      <div className="profile-container">
        <h1 className="profile-title">Mi Perfil</h1>
        
        <div className="p-5 d-flex flex-row justify-content-around">
          <div>
            <p className="text-start">
              <strong>Nombre:</strong> {user.Nombre}
            </p>
            <p className="text-start">
              <strong>Teléfono:</strong>
              {isEditingTelefono ? (
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="profile-input"
                    onBlur={() => handleSaveClick("telefono")}
                  />
                  {updatedFields.telefono && <FaCheck className="ms-2 text-success" />}
                </div>
              ) : (
                <>
                  <span>{telefono}</span>
                  <FaEdit
                    className="edit-icon"
                    onClick={() => handleEditClick("telefono")}
                  />
                </>
              )}
            </p>
            <p className="text-start">
              <strong>Correo:</strong>
              {isEditingCorreo ? (
                <div className="d-flex align-items-center">
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    className="profile-input"
                    onBlur={() => handleSaveClick("correo")}
                  />
                  {updatedFields.correo && <FaCheck className="ms-2 text-success" />}
                </div>
              ) : (
                <>
                  <span>{correo}</span>
                  <FaEdit
                    className="edit-icon"
                    onClick={() => handleEditClick("correo")}
                  />
                </>
              )}
            </p>
            <p className="text-start">
              <strong>Número Documento:</strong> {user.NumeroDocumento}
            </p>
            <p className="text-start">
              <strong>Contraseña:</strong>
              {isEditingPass ? (
                <div className="d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="profile-input"
                    onBlur={() => handleSaveClick("pass")}
                  />
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                  </button>
                  {updatedFields.pass && <FaCheck className="ms-2 text-success" />}
                </div>
              ) : (
                <>
                  <span>{pass}</span>
                  <FaEdit
                    className="edit-icon"
                    onClick={() => handleEditClick("pass")}
                  />
                </>
              )}
            </p>
          </div>

          <div>
            <p className="text-start">
              <strong>Meses Atrasados:</strong> {user.MesesAtrasados}
            </p>
            <p className="text-start">
              <strong>Espacios Parqueadero</strong>
            </p>
            <p className="text-start">
              <strong>Moto:</strong> {espacioMoto}
            </p>
            <p className="text-start">
              <strong>Carro:</strong> {espacioCarro}
            </p>
            <p className="text-start">
              <strong>Código Vivienda:</strong> {user.CodigoVivienda}
            </p>
          </div>
        </div>
      </div>

      {showAlert && (
        <div
          className={`alert ${
            alertMessage.includes("correctamente")
              ? "alert-success"
              : "alert-danger"
          } alert-dismissible fade show`}
          role="alert"
          style={{
            position: "fixed",
            top: "10%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          {alertMessage}
        </div>
      )}
    </>
  );
};

export default Profile;
