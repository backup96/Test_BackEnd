import { useState } from "react";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Validation from "../../auth/../../Components/Componentes_Validaciones/Validation";
import { ToastContainer, toast } from "react-toastify";
import Fondo1 from "../../../img/fondo1.png"; /* Importación de la imagen de fondo */

const LoginPortero = () => {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [values, setValues] = useState({
    nombreUsuario: "",
    clave: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      axios
        .post("/portero/loginPortero", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/MainPortero");
          } else {
            toast.error("Nombre de usuario o contraseña incorrectos");
          }
        })
        .catch((err) => console.log(err));
    }
    console.log(errors);
  };

  return (
    <>
      <ToastContainer />
      <div
        className="login-page"
        style={{
          backgroundImage: `url(${Fondo1})`, // Imagen de fondo importada
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh", // Ajustar a la altura completa de la ventana
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          filter: "brightness(90%)", // Oscurecer la imagen de fondo
        }}
      >
        <div className="login-box rounded-4 p-5 bg-white w-50">
          <div className="login-logo d-flex flex-column align-items-center">
            <Link
              to="/"
              className="text-decoration-none link-body-emphasis w-25 link-opacity-25-hover"
            >
              <div>
                <img src={myImg} alt="Logo" className="logo" />
              </div>
              <div className="fs-5">Volver al inicio</div>
            </Link>
          </div>
          <p className="login-box-msg p-0 text-center mb-2 fs-2">
            Ingrese como portero
          </p>
          <div className="card-body login-card-body">
            <form onSubmit={handleSubmit}>
              {/* Nombre y Apellido */}
              <div className="d-flex flex-row">
                <div className="me-4 w-50">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Usuario"
                    name="nombreUsuario"
                    onChange={(e) =>
                      setValues({ ...values, nombreUsuario: e.target.value })
                    }
                  />
                  {errors.nombreUsuario && (
                    <span className="text-danger">{errors.nombreUsuario}</span>
                  )}
                </div>
                <div className="w-50">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Contraseña"
                    name="clave"
                    onChange={(e) =>
                      setValues({ ...values, clave: e.target.value })
                    }
                  />
                  {errors.clave && (
                    <span className="text-danger">{errors.clave}</span>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block p-2 mt-2"
                  >
                    Ingresar
                  </button>
                </div>
              </div>
            </form>
            <hr className="hr-line" />
            <p className="mb-0">
              ¿Desea ingresar como{" "}
              <Link
                to="/LoginPropietario"
                className="text-decoration-none text-primary fw-bold"
              >
                Propietario
              </Link>{" "}
              o{" "}
              <Link
                to="/LoginAdministrador"
                className="text-decoration-none text-primary fw-bold"
              >
                Administrador
              </Link>
              ?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPortero;
