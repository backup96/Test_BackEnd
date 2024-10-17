import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png";
import Validation from "./Validation";

const LoginPropietario = () => {
  const [values, setValues] = useState({
    Usuario: "",
    Pass: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  //envío del formulario
  

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      axios
        .post("http://localhost:8081/loginPropietario", values)
        .then((res) => {
          if (res.data.Status === "Success") {
            navigate("/MainPropietario");
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
          backgroundImage: `url(${Fondo1})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          filter: "brightness(90%)",
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
            Ingrese como propietario
          </p>
          <div className="card-body login-card-body">
            <form action="" onSubmit={handleSubmit}>
              <div className="d-flex flex-row">
                <div className="me-4 w-50">
                  <label
                    className="text-start w-100 fw-normal"
                    htmlFor="nombreUsuario"
                  >
                    Nombre de usuario
                  </label>
                  <input
                    id="nombreUsuario"
                    type="text"
                    className="form-control"
                    name="nombreUsuario"
                    required
                    onChange={(e) =>
                      setValues({ ...values, Usuario: e.target.value })
                    }
                  />
                  {errors.nombreUsuario && (
                    <span className="text-danger">{errors.nombreUsuario}</span>
                  )}
                </div>
                <div className="w-50">
                  <label className="text-start w-100 fw-normal" htmlFor="clave">
                    Contraseña
                  </label>
                  <input
                    id="clave"
                    type="password"
                    className="form-control"
                    name="clave"
                    required
                    onChange={(e) =>
                      setValues({ ...values, Pass: e.target.value })
                    }
                  />
                  {errors.clave && (
                    <span className="text-danger">{errors.clave}</span>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="btn btn-success btn-block p-2 mt-2"
                >
                  Ingresar
                </button>
              </div>
            </form>
            <hr className="hr-line" />
            <p className="mb-0">
              ¿No tiene una cuenta?{" "}
              <Link
                to="/RegisterPropietario"
                className="text-center text-decoration-none fw-bold"
              >
                Enviar solicitud para creación de cuenta
              </Link>
            </p>
            <p className="mb-0">
              ¿Desea ingresar como{" "}
              <Link to="/LoginPortero" className="text-decoration-none fw-bold">
                Portero
              </Link>{" "}
              o{" "}
              <Link
                to="/LoginAdministrador"
                className="text-decoration-none fw-bold"
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

export default LoginPropietario;
