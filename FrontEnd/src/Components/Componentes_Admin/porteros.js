import axios from "axios";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import ValidationReg from "../../Components/Componentes_Validaciones/ValidationReg";
import { ToastContainer, toast } from "react-toastify";

/* Añadir iconos a la libraria */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);
library.add(faXmark);
library.add(faCheck);

const Porteros = ({ item, currentRecords, apiS }) => {
  const [accion, setAccion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");

  const [values, setValues] = useState({
    Nombre: "",
    Apellido: "",
    NumeroDocumento: "",
    Tel: "",
    Correo: "",
    TipoTurno: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const [errors, setError] = useState({});

  const enviar = async (e) => {
    e.preventDefault();
    const validationErrors = ValidationReg(values, currentRecords, apiS);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      try {
        if (accion === "Actualizar") {
          // if (porteros.id) {
          //   const response = await axios.patch(
          //     `http://localhost:4000/${apiS}/${porteros.id}`,
          //     {
          //       Nombre: porteros.Nombre,
          //       NumeroDocumento: porteros.NumeroDocumento,
          //       Teléfono: porteros.Teléfono,
          //       Correo: porteros.Correo,
          //       TipoTurno: porteros.TipoTurno,
          //       User: porteros.User,
          //       Pass: porteros.Pass,
          //       id: porteros.id,
          //     }
          //   );
          //   console.log(response.status);
          //   if (response.status === 200) {
          //     setStatus(response.status);
          //     setTimeout(() => {
          //       setStatus("");
          //     }, 5000);
          //     setPorteros((prevUsuario) => ({
          //       ...prevUsuario,
          //       id: "",
          //     }));
          //   }
          // }
        } else if (accion === "Eliminar") {
          // if (porteros.id) {
          //   const response = await axios.delete(
          //     `http://localhost:4000/${apiS}/${porteros.id}`
          //   );
          //   console.log(response.status);
          //   if (response.status === 200) {
          //     setShowAlert(false);
          //     setStatus(response.status);
          //     setTimeout(() => {
          //       setStatus("");
          //     }, 5000);
          //   }
          // } else {
          //   setShowAlert(false);
          // }
        } else if (accion === "Insertar") {
          axios
            .post("/admin/postPorteros", values)
            .then((res) => {
              if (res.status === 200) {
                toast.success("Portero insertado correctamente");
              } else {
                toast.error("Ocurrio un error al insertar el portero");
              }
            })
            .catch((err) => console.log(err));
        }
      } catch (error) {
        console.error(error);
        setAccion("");
        setStatus("err");
        setTimeout(() => {
          setStatus("");
        }, 5000);
      }
    } 
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  // const eliminar = (record) => {
  //   if (apiS === "Porteros") {
  //     setPorteros((prevSalon) => ({
  //       ...prevSalon,
  //       id: record,
  //     }));
  //   }
  //   setAccion(() => "Eliminar");
  // };

  const fetchFilteredRecords = async (term) => {
    try {
      if (term) {
        const response = await axios.get(
          `http://localhost:4000/${apiS}?NumeroDocumento=${term}`
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
      <ToastContainer />
      <form
        className="d-flex mb-3 align-items-end"
        role="search"
        onSubmit={handleSearch}
      >
        <div className="w-100 me-5">
          <label className="text-start w-100 fw-normal" for="searchParam">
            Buscar por número de identidad
          </label>
          <input
            id="searchParam"
            className="form-control me-2"
            type="search"
            placeholder="Ejemplo -> 1056798564"
            aria-label="Search"
            required
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setCurrentAccion("Consultar")}
          className="btn btn-success py-1"
          type="submit"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>
      <table
        id="example2"
        className="table table-bordered table-hover table-sm"
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
            <th
              className="sorting sorting text-light bg-dark"
              tabIndex="0"
              aria-controls="example2"
              rowSpan="1"
              colSpan="1"
              aria-label="Platform(s): activate to sort column ascending"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {accion !== "Consultar"
            ? currentRecords.map((record, index) => (
                <tr key={index}>
                  <td>{`${record.nombre} ${record.apellido}`}</td>
                  <td>{record.numDocumento}</td>
                  <td>{record.telefono}</td>
                  <td>{record.correo}</td>
                  <td>{record.turno}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            setShowAlert(true);
                            setEliminarRecord(record.id);
                          }}
                          class="btn btn-danger p-2"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning p-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setValues((prevPorteros) => ({
                              ...prevPorteros,
                              Nombre: record.nombre,
                              Apellido: record.apellido,
                              NumeroDocumento: record.numDocumento,
                              Tel: record.telefono,
                              Correo: record.correo,
                              TipoTurno: record.idTipoTurnoFK,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            : filteredRecords.map((record, index) => (
                <tr key={index}>
                  <td>{record.Nombre}</td>
                  <td>{record.NumeroDocumento}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record.TipoTurno}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            // onClick={() => eliminar(record.id)}
                            type="submit"
                            className="btn btn-danger px-2"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </form>
                      </div>
                      <div className="mx-2">
                        <button
                          type="button"
                          className="btn btn-warning px-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          // onClick={() => {
                          //   setPorteros((prevPorteros) => ({
                          //     ...prevPorteros,
                          //     Nombre: record.Nombre,
                          //     NumeroDocumento: record.NumeroDocumento,
                          //     Teléfono: record.Teléfono,
                          //     Correo: record.Correo,
                          //     TipoTurno: record.TipoTurno,
                          //     User: record.User,
                          //     Pass: record.Pass,
                          //     id: record.id,
                          //   }));
                          //   setCurrentAccion("Actualizar");
                          // }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog w-75 p-0 rounded-4">
              <div class="modal-content w-100">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Porteros
                  </h1>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <form onSubmit={enviar}>
                  <div class="modal-body">
                    <div className="d-flex flex-row">
                      <div className="me-3">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Nombre
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            value={values.Nombre}
                            onChange={(e) =>
                              setValues((prevPorteros) => ({
                                ...prevPorteros,
                                Nombre: e.target.value,
                              }))
                            }
                          />
                          {errors.Nombre && (
                            <span className="text-danger">{errors.Nombre}</span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Numero de Documento
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputEmail1"
                            value={values.NumeroDocumento}
                            onChange={(e) =>
                              setValues((prevPorteros) => ({
                                ...prevPorteros,
                                NumeroDocumento: e.target.value,
                              }))
                            }
                          />
                          {errors.NumeroDocumento && (
                            <span className="text-danger">
                              {errors.NumeroDocumento}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="me-3">
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Apellido
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputEmail1"
                            value={values.Apellido}
                            onChange={(e) =>
                              setValues((prevPorteros) => ({
                                ...prevPorteros,
                                Apellido: e.target.value,
                              }))
                            }
                          />
                          {errors.Apellido && (
                            <span className="text-danger">
                              {errors.Apellido}
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Teléfono
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputEmail1"
                            value={values.Tel}
                            onChange={(e) =>
                              setValues((prevPorteros) => ({
                                ...prevPorteros,
                                Tel: e.target.value,
                              }))
                            }
                          />
                          {errors.Tel && (
                            <span className="text-danger">{errors.Tel}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 mx-5 px-5">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Tipo de Turno
                      </label>
                      <select
                        id="exampleInputEmail1"
                        class="form-select"
                        aria-label="Default select example"
                        onChange={(e) => {
                          setValues((prevPorteros) => ({
                            ...prevPorteros,
                            TipoTurno: e.target.value,
                          }));
                          console.log(values.TipoTurno);
                        }}
                      >
                        <option selected>Seleccione el tipo de turno</option>
                        <option value="1">Nocturno</option>
                        <option value="2">Diurno</option>
                        <option value="3">Mixto</option>
                      </select>
                      {errors.TipoTurno && (
                        <span className="text-danger">{errors.TipoTurno}</span>
                      )}
                    </div>
                    <div className="me-3">
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Correo
                        </label>
                        <input
                          type="mail"
                          className="form-control"
                          id="exampleInputEmail1"
                          value={values.Correo}
                          onChange={(e) =>
                            setValues((prevPorteros) => ({
                              ...prevPorteros,
                              Correo: e.target.value,
                            }))
                          }
                        />
                        {errors.Correo && (
                          <span className="text-danger">{errors.Correo}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      data-bs-dismiss={accion === "" ? "modal" : ""}
                      type="submit"
                      className={
                        accion === "Actualizar"
                          ? "btn btn-warning"
                          : accion === "Insertar"
                          ? "btn btn-success w-25 m-0 ms-1 h-100"
                          : ""
                      }
                    >
                      {accion === "Actualizar" ? (
                        <FontAwesomeIcon icon={faPenToSquare} />
                      ) : accion === "Insertar" ? (
                        <FontAwesomeIcon icon={faSquarePlus} />
                      ) : (
                        ""
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="5" className="sorting text-light bg-dark"></th>
            <th rowSpan="1" colSpan="1" className="sorting text-light bg-dark">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setValues((prevReuniones) => ({
                    ...prevReuniones,
                    Nombre: "",
                    Apellido: "",
                    NumeroDocumento: "",
                    Teléfono: "",
                    Correo: "",
                    TipoTurno: "",
                    User: "",
                    Pass: "",
                  }));
                  setCurrentAccion("Insertar");
                }}
              >
                <FontAwesomeIcon icon={faSquarePlus} />
              </button>
            </th>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default Porteros;
