import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Logins.css";
import myImg from "../../../img/logo2.png";
import Fondo1 from "../../../img/fondo1.png"; /* Importación de la imagen de fondo */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ValidationReg from "../../../Components/Componentes_Validaciones/ValidationReg";
import { ToastContainer, toast } from "react-toastify";

library.add(faCheck);

const RegisterPropietario = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const [values, setValues] = useState({
    Nombre: "",
    Apellido: "",
    NumeroDocumento: 0,
    Tel: 0,
    Correo: "",
    CodigoVivienda: 0,
    Archivo: "",
  });

  const [errors, setError] = useState({});

  const [data, setDatos] = useState([]);

  useEffect(() => {
    async function fetchApartamentos() {
      try {
        const response = await axios.get(
          `/public/Apartamentos`
        );
        setDatos(response.data);
        if (response.data.length === 0) {
          setDatos([]);
        }
      } catch (error) {
        console.error("Error al obtener los apartamentos:", error);
      }
    }

    fetchApartamentos();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const apiS = ""
    const validationErrors = ValidationReg(values, data, apiS);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      // Crear un objeto FormData para enviar los datos incluyendo el archivo
      const formData = new FormData();

      // Agregar los datos del formulario al FormData
      formData.append("Nombre", values.Nombre);
      formData.append("Apellido", values.Apellido);
      formData.append("NumeroDocumento", values.NumeroDocumento);
      formData.append("Tel", values.Tel);
      formData.append("Correo", values.Correo);
      formData.append("CodigoVivienda", values.CodigoVivienda);

      // Agregar el archivo al FormData
      formData.append("Archivo", values.Archivo);
      axios
        .post("/propietario/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Header que indica el envio de datos planos y Archivos
          },
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Solicitud enviada correctamente");
          } else {
            toast.error("Ocurrio un error al intentar enviar la solicitud");
          }
        })
        .catch((err) => console.log(err));
    } console.log(errors)
  };

  const [fileName, setFileName] = useState(
    "Adjuntar Foto del Contrato de Propiedad o Certificado de Tradición y Libertad"
  );

  const handleButtonClick = () => {
    document.getElementById("inputGroupFile04").click();
  };

  const defFile = (e) => {
    const file = e.target.files[0];
    setValues({ ...values, Archivo: file });
    if (file) {
      setFileName(file.name);
    } else {
      setFileName(
        "Adjuntar Foto del Contrato de Propiedad o Certificado de Tradición y Libertad"
      );
    }
  };

  return (
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
      <div className="login-box rounded-4 p-5 bg-white">
        <div className="d-flex flex-row ">
          <div className=" w-50">
            <div className="login-logo d-flex justify-content-start">
              <img src={myImg} alt="Logo" className="logo" />
            </div>
            <p className="login-box-msg p-0 text-start fs-1">
              Enviar solicitud para creación de cuenta
            </p>
          </div>
          <div className="card-body login-card-body p-0 h-100">
            <form onSubmit={handleSubmit} className="h-100">
              {/* Nombre y Apellido */}
              <div className="d-flex flex-row mb-2">
                <div className="me-4 w-50">
                  <input
                    type="text"
                    className="input-group form-control"
                    placeholder="Nombre"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, Nombre: e.target.value })
                    }
                  />
                  {errors.Nombre && (
                    <span className="text-danger">{errors.Nombre}</span>
                  )}
                </div>
                <div className="w-50">
                  <input
                    type="text"
                    className="input-group form-control"
                    placeholder="Apellido"
                    name="lastName"
                    onChange={(e) =>
                      setValues({ ...values, Apellido: e.target.value })
                    }
                  />
                  {errors.Apellido && (
                    <span className="text-danger">{errors.Apellido}</span>
                  )}
                </div>
              </div>
              <div className="mb-2 d-flex flex-row">
                <div className="me-4 w-50">
                  <input
                    type="number"
                    className="input-group form-control"
                    placeholder="Número Documento"
                    name="numDoc"
                    onChange={(e) =>
                      setValues({ ...values, NumeroDocumento: e.target.value })
                    }
                  />
                  {errors.NumeroDocumento && (
                    <span className="text-danger">
                      {errors.NumeroDocumento}
                    </span>
                  )}
                </div>
                <div className="w-50">
                  <input
                    type="number"
                    className="input-group form-control"
                    placeholder="Número Telefónico"
                    name="Tel"
                    onChange={(e) =>
                      setValues({ ...values, Tel: e.target.value })
                    }
                  />
                  {errors.Tel && (
                    <span className="text-danger">{errors.Tel}</span>
                  )}
                </div>
              </div>
              <div className="mb-2 d-flex flex-row">
                <div className="me-4 w-50">
                  <input
                    type="email"
                    className="input-group form-control"
                    placeholder="Correo Electrónico"
                    name="correo"
                    onChange={(e) =>
                      setValues({ ...values, Correo: e.target.value })
                    }
                  />
                  {errors.Correo && (
                    <span className="text-danger">{errors.Correo}</span>
                  )}
                </div>
                <div className="w-50">
                  <input
                    type="number"
                    className="input-group form-control"
                    placeholder="Código de Vivienda"
                    name="codAp"
                    onChange={(e) =>
                      setValues({ ...values, CodigoVivienda: e.target.value })
                    }
                  />
                  {errors.CodigoVivienda && (
                    <span className="text-danger">{errors.CodigoVivienda}</span>
                  )}
                </div>
              </div>
              <div>
                <div className="d-flex flex-row justify-content-center mb-2">
                  <button
                    type="button"
                    className={
                      isHovered
                        ? "btn btn-outline-primary text-white"
                        : "btn btn-outline-primary text-primary"
                    }
                    onClick={handleButtonClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {!errors.Archivo ? (
                      fileName
                    ) : (
                      <span className="text-danger">{errors.Archivo}</span>
                    )}
                    <input
                      type="file"
                      id="inputGroupFile04"
                      className="d-none"
                      aria-describedby="inputGroupFileAddon04"
                      aria-label="Upload"
                      onChange={(e) => defFile(e)}
                      accept="application/pdf"
                      hidden
                    />
                  </button>
                </div>
              </div>
              <div>
                <div>
                  <button type="submit" className="btn btn-success btn-block">
                    Enviar solicitud
                  </button>
                </div>
              </div>
              <div className="h-25">
                <hr className="hr-line" />
                <p className=" mb-0">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/LoginPropietario"
                    className="text-center text-decoration-none fw-bold"
                  >
                    Iniciar Sesión
                  </Link>
                </p>
                <p className="mb-0">
                  ¿Desea ingresar como{" "}
                  <Link
                    to="/LoginPortero"
                    className="text-decoration-none fw-bold"
                  >
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPropietario;
