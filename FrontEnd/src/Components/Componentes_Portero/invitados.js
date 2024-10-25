import axios from "axios";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPenToSquare,
  faTrash,
  faSquarePlus,
  faXmark,
  faCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useTable } from "./navBar";

/* Añadir iconos a la librería */
library.add(faTrash, faPenToSquare, faSquarePlus, faXmark, faCheck, faClock);

const Invitados = ({ item, setcurrentRecords }) => {
  const [accion, setAccion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");
  const [currentRecords, setCurrentRecords] = useState([]);

  const {
    setCurrentTable: setCurrentContextTabla,
    setInvitado: setContextInvitado,
  } = useTable();

  const [invitados, setInvitados] = useState({
    Nombre: "",
    NumeroDocumento: "",
    Teléfono: "",
    Correo: "",
    NumeroParqueadero: "",
    Costo: "",
    CodigoVivienda: "",
    HoraInicio: "",
    Tiempo: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  useEffect(() => {
    // Función para obtener los registros de la vista invitados
    const fetchInvitados = async () => {
      try {
        const response = await axios.get("http://localhost:8081/invitados");
        setCurrentRecords(response.data);
        setFilteredRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchInvitados();
  }, []);

  const enviar = (e) => {
    e.preventDefault();

    if (accion === "Actualizar") {
      if (invitados.id) {
        // Aquí actualizarías el estado local o la lógica según sea necesario
        setStatus(200);
        setTimeout(() => {
          setStatus("");
        }, 5000);
        setInvitados((prevUsuario) => ({
          ...prevUsuario,
          id: "",
        }));
      }
    } else if (accion === "Eliminar") {
      if (invitados.id) {
        // Aquí eliminarías el registro del estado local
        setShowAlert(false);
        setStatus(200);
        setTimeout(() => {
          setStatus("");
        }, 5000);
      } else {
        setShowAlert(false);
      }
    } else if (accion === "Insertar") {
      // Aquí insertarías el nuevo invitado en el estado local
      setStatus(201);
      setTimeout(() => {
        setStatus("");
      }, 5000);
    }
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const eliminar = (record) => {
    setInvitados((prevSalon) => ({
      ...prevSalon,
      id: record,
    }));
    setAccion(() => "Eliminar");
  };

  // Modificación: Búsqueda por nombre en lugar de documento
  const fetchFilteredRecords = (term) => {
    if (term) {
      const results = currentRecords.filter((record) =>
        record.Nombre.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredRecords(results);
    } else {
      setFilteredRecords(currentRecords);
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
            ¿Está seguro de eliminar este registro?
            <form className="p-0" onSubmit={enviar}>
              <div className="d-flex flex-row mt-3 justify-content-end">
                <div>
                  <button
                    type="submit"
                    className="btn btn-danger p-0 m-0"
                    onClick={() => {
                      eliminar();
                    }}
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>

                <div className="ms-3">
                  <button
                    type="submit"
                    className="btn btn-success p-0 m-0"
                    onClick={() => {
                      eliminar(eliminarRecord);
                    }}
                    style={{ width: "30px", height: "30px" }}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : status === 200 || status === 201 ? (
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

      {/* Barra de búsqueda */}
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

      {/* Tabla de invitados */}
      <table
        id="example2"
        className="table table-bordered table-hover table-sm"
        aria-describedby="example2_info"
      >
        <thead>
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
        </thead>
        <tbody>
          {accion !== "Consultar"
            ? currentRecords.map((record, index) => (
              <tr key={index}>
                  <td>{record.Nombre} {record.Apellido}</td> {/* Concatenar nombre y apellido */}
                  <td>{record["Número de Documento"]}</td>
                  <td>{record.Teléfono}</td>
                  <td>{record.Correo}</td>
                  <td>{record["Número de parqueadero"]}</td>
                  <td>{record.Placa}</td>
                  <td>{record["Código de Vivienda"]}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2 btn btn-info p-2">
                        <FontAwesomeIcon
                          icon={faClock}
                          role="button"
                          onClick={() => {
                            setContextInvitado(() => record.id);
                            setCurrentContextTabla("Clock");
                          }} // Redirige con el ID del invitado
                        />
                      </div>
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
                            setInvitados((prevPropietario) => ({
                              ...prevPropietario,
                              Nombre: record.Nombre,
                              NumeroDocumento: record.NumeroDocumento,
                              Teléfono: record.Teléfono,
                              Correo: record.Correo,
                              NumeroParqueadero: record.NumeroParqueadero,
                              Costo: record.Costo,
                              CodigoVivienda: record.CodigoVivienda,
                              id: record.id,
                            }));
                            setCurrentAccion("Actualizar");
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} />
                        </button>
                      </div>
                    </div>
                    <div
                      class="modal fade"
                      id="exampleModal"
                      tabindex="-1"
                      aria-labelledby="exampleModalLabel"
                      aria-hidden="true"
                    >
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              {accion} Invitados
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
                                  required
                                  value={invitados.Nombre}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      Nombre: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Número de Documento
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.NumeroDocumento}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      NumeroDocumento: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Teléfono
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.Teléfono}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      Teléfono: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Correo
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.Correo}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      Correo: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Número de Parqueadero
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.NumeroParqueadero}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      NumeroParqueadero: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Costo
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.Costo}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      Costo: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Código de Vivienda
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={invitados.CodigoVivienda}
                                  onChange={(e) =>
                                    setInvitados((prevApartamento) => ({
                                      ...prevApartamento,
                                      CodigoVivienda: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                class="btn btn-danger"
                                data-bs-dismiss="modal"
                              >
                                Cerrar
                              </button>
                              <button
                                data-bs-dismiss={accion === "" ? "modal" : ""}
                                type="submit"
                                className={
                                  accion === "Actualizar"
                                    ? "btn btn-warning"
                                    : accion === "Insertar"
                                    ? "btn btn-success w-25 m-0 ms-1 h-100"
                                    : "btn btn-primary w-25 m-0 ms-1 h-100"
                                }
                              >
                                {accion === "" ? "Volver" : accion}
                              </button>
                            </div>
                          </form>
                        </div>
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
                  <td>{record.NumeroParqueadero}</td>
                  <td>{record.Costo}</td>
                  <td>{record.CodigoVivienda}</td>
                  <td>
                    <div className="d-flex flex-row">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => eliminar(record.id)}
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
                          className="btn btn-warning px-2 py-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setInvitados((prevPropietario) => ({
                              ...prevPropietario,
                              Nombre: record.Nombre,
                              NumeroDocumento: record.NumeroDocumento,
                              Teléfono: record.Teléfono,
                              Correo: record.Correo,
                              NumeroParqueadero: record.NumeroParqueadero,
                              Costo: record.Costo,
                              CodigoVivienda: record.CodigoVivienda,
                              id: record.id,
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
              ))}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Invitados
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
                        required
                        value={invitados.Nombre}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            Nombre: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Numero de Documento
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.NumeroDocumento}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            NumeroDocumento: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Teléfono
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.Teléfono}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            Teléfono: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Correo
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.Correo}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            Correo: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Numero de Parqueadero
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.NumeroParqueadero}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            NumeroParqueadero: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Costo
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.Costo}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            Costo: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Codigo de Vivienda
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={invitados.CodigoVivienda}
                        onChange={(e) =>
                          setInvitados((prevApartamento) => ({
                            ...prevApartamento,
                            CodigoVivienda: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-danger"
                      data-bs-dismiss="modal"
                    >
                      Cerrar
                    </button>
                    <button
                      data-bs-dismiss={accion === "" ? "modal" : ""}
                      type="submit"
                      className={
                        accion === "Actualizar"
                          ? "btn btn-warning"
                          : accion === "Insertar"
                          ? "btn btn-success w-25 m-0 ms-1 h-100"
                          : "btn btn-primary w-25 m-0 ms-1 h-100"
                      }
                    >
                      {accion === "" ? "Volver" : accion}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </tbody>
        <tfoot>
          <tr>
            <th colSpan="7" className="sorting text-light bg-dark"></th>
            <th rowSpan="1" colSpan="1" className="sorting text-light bg-dark">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setInvitados((prevReuniones) => ({
                    ...prevReuniones,
                    Nombre: "",
                    NumeroDocumento: "",
                    Teléfono: "",
                    Correo: "",
                    NumeroParqueadero: "",
                    Costo: "",
                    CodigoVivienda: "",
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

export default Invitados;