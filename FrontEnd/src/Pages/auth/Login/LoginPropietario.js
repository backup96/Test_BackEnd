import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png";

const Validation = (values) => {
  let errors = {};

  // Validaciones
  if (!values.nombreUsuario) {
    errors.nombreUsuario = "El nombre de usuario es requerido";
  } else if (values.nombreUsuario.length < 15 || values.nombreUsuario.length > 30) {
    errors.nombreUsuario = "El nombre de usuario debe tener entre 15 y 30 caracteres";
  } else if (!/^[A-Z][a-zA-Z0-9]*$/.test(values.nombreUsuario)) {
    errors.nombreUsuario = "El nombre de usuario debe empezar con una mayúscula y contener solo letras y números";
  }

  if (!values.clave) {
    errors.clave = "La contraseña es requerida";
  } else if (values.clave.length < 6 || values.clave.length > 15) {
    errors.clave = "La contraseña debe tener entre 6 y 15 caracteres";
  }

  return errors;
};

const LoginPropietario = () => {
  const [values, setValues] = useState({
    nombreUsuario: '',
    clave: ''
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  //cambios en los campos del formulario
  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  //envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    // Si hay errores de validación, no se envía la solicitud
    if (Object.keys(validationErrors).length > 0) {
      return; // No procede si hay errores de validación
    }

    // Si no hay errores de validación, procede con la solicitud
    axios.post('http://localhost:8081/personas_cuenta', {
      nombreUsuario: values.nombreUsuario,
      clave: values.clave
    })
      .then(res => {
        console.log("Response:", res.data); // Depura 
        if (res.data === "Success") {
          navigate('/mainPropietario'); // Redirige si la autenticación es exitosa
        } else {
          toast.error("Usuario o contraseña incorrectos"); // Alerta de error
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Error en la solicitud"); // Alerta de error en la solicitud
      });
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
            <Link to="/" className="text-decoration-none link-body-emphasis w-25 link-opacity-25-hover">
              <div>
                <img src={myImg} alt="Logo" className="logo" />
              </div>
              <div className="fs-5">Volver al inicio</div>
            </Link>
          </div>
          <p className="login-box-msg p-0 text-center mb-2 fs-2">Ingrese como propietario</p>
          <div className="card-body login-card-body">
            <form action="" onSubmit={handleSubmit}>
              <div className="d-flex flex-row">
                <div className="me-4 w-50">
                  <label className="text-start w-100 fw-normal" htmlFor="nombreUsuario">
                    Nombre de usuario
                  </label>
                  <input
                    id="nombreUsuario"
                    type="text"
                    className="form-control"
                    name="nombreUsuario"
                    required
                    onChange={handleInput}
                  />
                  {errors.nombreUsuario && <span className="text-danger">{errors.nombreUsuario}</span>}
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
                    onChange={handleInput}
                  />
                  {errors.clave && <span className="text-danger">{errors.clave}</span>}
                </div>
              </div>
              <div>
                <button type="submit" className="btn btn-success btn-block p-2 mt-2">
                  Ingresar
                </button>
              </div>
            </form>
            <hr className="hr-line" />
            <p className="mb-0">
              ¿No tiene una cuenta?{" "}
              <Link to="/RegisterPropietario" className="text-center text-decoration-none fw-bold">
                Enviar solicitud para creación de cuenta
              </Link>
            </p>
            <p className="mb-0">
              ¿Desea ingresar como{" "}
              <Link to="/LoginPortero" className="text-decoration-none fw-bold">Portero</Link>{" "}
              o{" "}
              <Link to="/LoginAdministrador" className="text-decoration-none fw-bold">Administrador</Link>
              ?
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPropietario;
