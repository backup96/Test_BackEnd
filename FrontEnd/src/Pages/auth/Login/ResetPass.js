import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png"; /* Importación de la imagen de fondo */
import ValidationNewPass from "../../../Components/Componentes_Validaciones/ValidationNewPass";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";

const ResetPass = () => {
  const token = useParams();

  const [values, setValues] = useState({
    Pass: "",
    RecPass: "",
    token: token.token,
  });

  const [errors, setError] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = ValidationNewPass(values);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      axios
        .post("/public/reset-password", values)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Contraseña actualizada correctamente");
          } else if (res.status === 400) {
            
          } else {
            toast.error("Ocurrio un error al intentar iniciar sesión");
          }
        })
        .catch((err) => toast.error("Vencio el link de recuperación de contraseña"));
    }
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
        {console.log(values)}
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
            Recuperación de constraseña
          </p>
          <div className="card-body login-card-body">
            <form action="" onSubmit={handleSubmit}>
              <div className="d-flex flex-row">
                <div className="me-4 w-100">
                  <label
                    className="text-start w-100 fw-normal"
                    htmlFor="Username"
                  >
                    Ingrese su nueva contraseña
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, Pass: e.target.value })
                    }
                  />
                  {errors.Pass && (
                    <span className="text-danger">{errors.Pass}</span>
                  )}
                </div>
                <div className="me-4 w-100">
                  <label
                    className="text-start w-100 fw-normal"
                    htmlFor="Username"
                  >
                    Repita la contraseña
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="form-control"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, RecPass: e.target.value })
                    }
                  />
                  {errors.RecPass && (
                    <span className="text-danger">{errors.RecPass}</span>
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

export default ResetPass;
