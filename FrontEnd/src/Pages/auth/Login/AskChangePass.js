import { useState } from "react";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png"; /* Importación de la imagen de fondo */
import ValidationPass from "../../../Components/Componentes_Validaciones/ValidationPass";
import { ToastContainer, toast } from "react-toastify";

const AskChangePass = () => {
  const [values, setValues] = useState({
    Correo: "",
  });

  const [errors, setError] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = ValidationPass(values);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      axios
        .post("/public/RecPass", values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Revisa tu correo, hemos enviado un link para el cambio de contraseña")
          } else {
            toast.error("Ocurrio un error al intentar iniciar sesión");
          }
        })
        .catch((err) => console.log(err));
    } console.log(errors)
  };

  return (
    <>
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
        <ToastContainer />

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
            Ingrese el correo vinculado a su cuenta
          </p>
          <div className="card-body login-card-body">
            <form action="" onSubmit={handleSubmit}>
              <div className="d-flex flex-row">
                <div className="me-4 w-100">
                  <label
                    className="text-start w-100 fw-normal"
                    htmlFor="Username"
                  >
                    Correo electrónico
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, Correo: e.target.value })
                    }
                  />
                  {errors.Correo && (
                    <span className="text-danger">{errors.Correo}</span>
                  )}
                </div>
              </div>
              <div>
                <div>
                  <button
                    type="submit"
                    className="btn btn-success btn-block p-2 mt-2"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AskChangePass;
