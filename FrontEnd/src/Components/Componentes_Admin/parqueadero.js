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
/* Añadir iconos a la libraria */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);
library.add(faXmark);
library.add(faCheck);

const Parqueadero = ({ item, currentRecords, apiS }) => {
  const [accion, setAccion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");

  const [parqueadero, setParqueadero] = useState({
    NumeroEspacio: "",
    TipoEspacio: "",
    Estado: "",
    id: "",
  });

  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);
  const [filteredAtt, setFilteredAtt] = useState("");

  const enviar = async (e) => {
    e.preventDefault();

    try {
      if (accion === "Actualizar") {
        if (parqueadero.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${parqueadero.id}`,
            {
              NumeroEspacio: parqueadero.NumeroEspacio,
              TipoEspacio: parqueadero.TipoEspacio,
              Estado: parqueadero.Estado,
              id: parqueadero.id,
            }
          );
          console.log(response.status);
          if (response.status === 200) {
            setStatus(response.status);
            setTimeout(() => {
              setStatus("");
            }, 5000);
            setParqueadero((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Eliminar") {
        if (parqueadero.id) {
          const response = await axios.delete(
            `http://localhost:4000/${apiS}/${parqueadero.id}`
          );
          console.log(response.status);
          if (response.status === 200) {
            setShowAlert(false);
            setStatus(response.status);
            setTimeout(() => {
              setStatus("");
            }, 5000);
          }
        } else {
          setShowAlert(false);
        }
      } else if (accion === "Insertar") {
        const response = await axios.post(`http://localhost:4000/${apiS}`, {
          NumeroEspacio: parqueadero.NumeroEspacio,
          TipoEspacio: parqueadero.TipoEspacio,
          Estado: parqueadero.Estado,
        });
        console.log(response.status);
        if (response.status === 201) {
          setStatus(response.status);
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

  const eliminar = (record) => {
    if (apiS === "Parqueadero") {
      setParqueadero((prevSalon) => ({
        ...prevSalon,
        id: record,
      }));
    }
    setAccion(() => "Eliminar");
  };

  const fetchFilteredRecords = async (term, att) => {
    try {
      if (term) {
        const response = await axios.get(
          `http://localhost:4000/${apiS}?${att}=${term}`
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
    fetchFilteredRecords(searchTerm, filteredAtt);
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
                    class="btn btn-danger p-0 m-0"
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
                    class="btn btn-success p-0 m-0"
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
      <form
        className="d-flex mb-3 align-items-end"
        role="search"
        onSubmit={handleSearch}
      >
        <div className="w-100 me-5">
          <label className="text-start w-100 fw-normal" for="searchParam1">
            Buscar por número de espacio
          </label>
          <input
            id="searchParam1"
            className="form-control me-2"
            type="search"
            placeholder="Ejemplo -> 1"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilteredAtt("NumeroEspacio");
            }}
          />
        </div>
        <select
          className="form-select me-5"
          aria-label="Default select example"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredAtt("TipoEspacio");
          }}
        >
          <option selected>Buscar por tipo de espacio</option>
          <option value={"Moto"}>Moto</option>
          <option value={"Carro"}>Carro</option>
        </select>
        <button
          onClick={() => setCurrentAccion("Consultar")}
          className="btn btn-success ms-2 py-1"
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
                  <td>{record.NumeroEspacio}</td>
                  <td>{record.TipoEspacio}</td>
                  <td>{record.Estado}</td>
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
                            setParqueadero((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.NumeroEspacio,
                              TipoEspacio: record.TipoEspacio,
                              Estado: record.Estado,
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
                        <div class="modal-content w-100">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                              {accion} Parqueadero
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
                                  Número de Espacio
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputEmail1"
                                  required
                                  value={parqueadero.NumeroEspacio}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      NumeroEspacio: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Tipo de Espacio
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={parqueadero.TipoEspacio}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      TipoEspacio: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Estado
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={parqueadero.Estado}
                                  onChange={(e) =>
                                    setParqueadero((prevParqueadero) => ({
                                      ...prevParqueadero,
                                      Estado: e.target.value,
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
                                    : ""
                                }
                              >
                                {accion}
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
                  <td>{record.NumeroEspacio}</td>
                  <td>{record.TipoEspacio}</td>
                  <td>{record.Estado}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
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
                          className="btn btn-warning px-2"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => {
                            setParqueadero((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.NumeroEspacio,
                              TipoEspacio: record.TipoEspacio,
                              Estado: record.Estado,
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
            <div class="modal-dialog p-0 rounded rounded-4">
              <div class="modal-content mx-0 my-5 w-100">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Parqueadero
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
                        Numero de Espacio
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputEmail1"
                        required
                        value={parqueadero.NumeroEspacio}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            NumeroEspacio: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Tipo de Espacio
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={parqueadero.TipoEspacio}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            TipoEspacio: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Estado
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleInputPassword1"
                        required
                        value={parqueadero.Estado}
                        onChange={(e) =>
                          setParqueadero((prevParqueadero) => ({
                            ...prevParqueadero,
                            Estado: e.target.value,
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
            <th colSpan="3" className="sorting text-light bg-dark"></th>
            <th rowSpan="1" colSpan="1" className="sorting text-light bg-dark">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setParqueadero((prevReuniones) => ({
                    ...prevReuniones,
                    NumeroEspacio: "",
                    TipoEspacio: "",
                    Estado: "",
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

export default Parqueadero;
