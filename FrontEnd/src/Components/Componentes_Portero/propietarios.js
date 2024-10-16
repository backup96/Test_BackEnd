import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPenToSquare, faSquarePlus, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

/* Añadir iconos a la librería */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);
library.add(faXmark);
library.add(faCheck);

const Propietario = ({ item, currentRecords, apiS }) => {
  const [accion, setAccion] = useState("");
  const [showAlert] = useState(false);
  const [status, setStatus] = useState("");

  const [propietarios, setPropietarios] = useState({
    CodigoVivienda: "",
    Nombre: "",
    Teléfono: "",
    Correo: "",
    EstadoEnvio: "",
    NumeroDocumento: "",
    MesesAtrasados: "",
    EspacioParqueadero: "",
    User: "",
    Pass: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const enviar = async (e) => {
    e.preventDefault();

    try {
      if (accion === "Actualizar") {
        if (propietarios.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${propietarios.id}`,
            {
              CodigoVivienda: propietarios.CodigoVivienda,
              Nombre: propietarios.Nombre,
              Teléfono: propietarios.Teléfono,
              Correo: propietarios.Correo,
              EstadoEnvio: propietarios.EstadoEnvio,
              NumeroDocumento: propietarios.NumeroDocumento,
              MesesAtrasados: propietarios.MesesAtrasados,
              EspacioParqueadero: propietarios.EspacioParqueadero,
              User: propietarios.User,
              Pass: propietarios.Pass,
              id: propietarios.id,
            }
          );
          if (response.status === 200) {
            setStatus(response.status);
            setAccion("");
            setTimeout(() => {
              setStatus("");
            }, 5000);
            setPropietarios((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Insertar") {
        const response = await axios.post(`http://localhost:4000/${apiS}`, {
          CodigoVivienda: propietarios.CodigoVivienda,
          Nombre: propietarios.Nombre,
          Teléfono: propietarios.Teléfono,
          Correo: propietarios.Correo,
          EstadoEnvio: propietarios.EstadoEnvio,
          NumeroDocumento: propietarios.NumeroDocumento,
          MesesAtrasados: propietarios.MesesAtrasados,
          EspacioParqueadero: propietarios.EspacioParqueadero,
          User: propietarios.User,
          Pass: propietarios.Pass,
        });
        if (response.status === 201) {
          setStatus(response.status);
          setAccion("");
          setTimeout(() => {
            setStatus("");
          }, 5000);
        }
      }
    } catch (error) {
      console.error(error);
      setAccion("");
      setStatus("err");
      setTimeout(() => {
        setStatus("");
      }, 5000);
    }
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const fetchFilteredRecords = async (term) => {
    try {
      if (term) {
        // Modificar la consulta para que busque por nombre, documento o código de vivienda
        const response = await axios.get(
          `http://localhost:4000/${apiS}?Nombre=${term}&NumeroDocumento=${term}&CodigoVivienda=${term}`
        );
        if (response.status === 200) {
          setFilteredRecords(response.data);
        }
      } else {
        setFilteredRecords(currentRecords);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al filtrar los registros");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm);
  };

  return (
    <>
      {showAlert === true ? (
        <div className="d-flex justify-content-center">
          <div
            className="alert alert-warning alert-dismissible fade show w-25 z-1 position-absolute px-4 py-4"
            role="alert"
            style={{ marginInlineEnd: "35%" }}
          >
            Esta seguro de eliminar este registro ?
            <form className="p-0" onSubmit={enviar}>
              <div className="d-flex flex-row mt-3 justify-content-end">
                <div>
                  <button
                    type="submit"
                    className="btn btn-danger p-0 m-0"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className="ms-3">
                  <button
                    type="submit"
                    className="btn btn-success p-0 m-0"
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : status === 200 ? (
        <div className="d-flex justify-content-center">
          <div
            className="alert alert-success alert-dismissible z-1 position-absolute fade show w-25 text-center"
            role="alert"
            style={{ marginInlineEnd: "35%" }}
          >
            Operación completada
          </div>
        </div>
      ) : status === 201 ? (
        <div className="d-flex justify-content-center">
          <div
            className="alert alert-success alert-dismissible z-1 position-absolute fade show w-25 text-center"
            role="alert"
            style={{ marginInlineEnd: "35%" }}
          >
            Operación completada
          </div>
        </div>
      ) : null}
      <form className="d-flex mb-3" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar por Nombre"
          aria-label="Search"
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          onClick={() => setCurrentAccion("Consultar")}
          className="btn btn-success py-1"
          type="submit"
        >
          Search
        </button>
      </form>
      <table
        id="example2"
        className="table table-bordered table-hover table-sm "
        aria-describedby="example2_info"
      >
        <thead>
          <tr>
            {item.map((item, index) => (
              <th
                className="sorting sorting text-light bg-dark"
                tabIndex="0"
                aria-controls="example2"
                rowSpan="1"
                colSpan="1"
                aria-label="Rendering engine: activate to sort column ascending"
                key={index}
              >
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {accion !== "Consultar"
            ? currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.CodigoVivienda}</td>
                  <td>{record.Nombre}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record.NumeroDocumento}</td>
                  <td>{record.MesesAtrasados}</td>
                </tr>
              ))
            : filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.CodigoVivienda}</td>
                  <td>{record.Nombre}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record.NumeroDocumento}</td>
                  <td>{record.MesesAtrasados}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </>
  );
};

export default Propietario;
