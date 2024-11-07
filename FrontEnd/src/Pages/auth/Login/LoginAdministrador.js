import { useState } from "react";
import axios from "axios";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png"; /* Importación de la imagen de fondo */
import Validation from "../../../Components/Componentes_Validaciones/Validation";
import { ToastContainer, toast } from "react-toastify";

const LoginAdministrador = () => {
  const [values, setValues] = useState({
    nombreUsuario: "",
    clave: "",
  });

  const [errors, setError] = useState({});

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      axios
        .post("/admin/login", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/MainAdmin");
          } else {
            toast.error("Nombre de usuario o contraseña incorrectos");
          }
        })
        .catch((err) => console.log(err));
    }
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
            Ingrese como administrador
          </p>
          <div className="card-body login-card-body">
            <form action="" onSubmit={handleSubmit}>
              <div className="d-flex flex-row">
                <div className="me-4 w-50">
                  <label
                    className="text-start w-100 fw-normal"
                    htmlFor="Username"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, nombreUsuario: e.target.value })
                    }
                  />
                  {errors.nombreUsuario && (
                    <span className="text-danger">{errors.nombreUsuario}</span>
                  )}
                </div>
                <div className="w-50">
                  <label className="text-start w-100 fw-normal" htmlFor="pass">
                    Contraseña
                  </label>
                  <input
                    id="pass"
                    type="password"
                    className="form-control"
                    name="password"
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
                    className="btn btn-danger btn-block p-2 mt-2"
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
                className="text-decoration-none text-danger fw-bold"
              >
                Propietario
              </Link>{" "}
              o{" "}
              <Link
                to="/LoginPortero"
                className="text-decoration-none text-danger fw-bold"
              >
                Portero
              </Link>
              ?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAdministrador;
