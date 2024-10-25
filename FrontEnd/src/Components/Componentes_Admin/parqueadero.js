import axios from "axios";
import { useState, useEffect } from "react";
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

const Parqueadero = ({ item, currentRecords, apiS, data }) => {
  const [accion, setAccion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");
  const [errors, setError] = useState({});
  const [searchTerm, setSearchTerm] = useState({
    Term: "",
    FilteredAtt: "",
  }); // Estado para el término de búsqueda

  useEffect(() => {
    if (accion === "Eliminar") {
      eliminar(values.NumeroEspacio);
    }
  }, [accion]);

  const [values, setValues] = useState({
    NumeroEspacio: "",
    TipoEspacio: "",
    Estado: "",
  });

  const customToast = (mess, record) => {
    return (
      <>
        {mess}
        <form className="p-0" onSubmit={enviar}>
          <div className="d-flex flex-row mt-3 justify-content-end">
            <div className="ms-3">
              <button
                type="submit"
                class="btn btn-success p-0 m-0"
                style={{ width: "30px", height: "30px" }}
              >
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  const data2 = "";

  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const enviar = (e) => {
    e.preventDefault();
    const validationErrors = ValidationReg(values, data, data2, apiS);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      try {
        if (accion === "Actualizar") {
          axios
            .post(`/admin/patch${apiS}`, values)
            .then((res) => {
              console.log(res.status);
              if (res.data.Status === "Success") {
                toast.success("Registro actualizado correctamente");
              } else if (res.status === 500) {
                toast.error("Ocurrio un error al actualizar el apartamento");
              }
            })
            .catch((err) => toast.error(""));
        } else if (accion === "Insertar") {
          console.log("Hellow");
          axios
            .post(`/admin/post${apiS}`, values)
            .then((res) => {
              if (res.data.Status === "Success") {
                toast.success("Espacio de parqueadero insertado correctamente");
              } else {
                toast.error("Ocurrio un error al insertar el espacio");
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
    } else if (accion === "Eliminar") {
      try {
        axios
          .post(`/admin/delete${apiS}`, values)
          .then((res) => {
            if (res.data.Status === "Success") {
              toast.success("Registro eliminado correctamente");
            } else {
              toast.error("Ocurrio un error al eliminar el registro");
            }
          })
          .catch((err) => console.log(err));
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

  const eliminar = (record) => {
    toast.warning(
      customToast("¿ Esta seguro de eliminar este registro ?"),
      record,
      {
        autoClose: 10000,
      }
    );
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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (searchTerm.FilteredAtt === "numEspacio") {
        const response = await axios.post(
          `/admin/getParqueaderoEsp1`,
          searchTerm
        );
        if (response.status === 200) {
          setFilteredRecords(response.data);
        }
      } else if (searchTerm.FilteredAtt === "tipoEspacio") {
        const response = await axios.post(
          `/admin/getParqueaderoEsp2`,
          searchTerm
        );
        if (response.status === 200) {
          setFilteredRecords(response.data);
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al filtrar los registros");
    }
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
          <label className="text-start w-100 fw-normal" for="searchParam1">
            Buscar por número de espacio
          </label>
          <input
            id="searchParam1"
            className="form-control me-2"
            type="search"
            placeholder="Ejemplo -> 1"
            aria-label="Search"
            onChange={(e) =>
              setSearchTerm({
                ...searchTerm,
                Term: e.target.value,
                FilteredAtt: "numEspacio",
              })
            }
          />
        </div>
        <select
          className="form-select me-5"
          aria-label="Default select example"
          onChange={(e) =>
            setSearchTerm({
              ...searchTerm,
              Term: e.target.value,
              FilteredAtt: "tipoEspacio",
            })
          }
        >
          <option selected>Buscar por tipo de espacio</option>
          <option value={"Moto"}>Moto</option>
          <option value={"Carro"}>Carro</option>
        </select>
        <button
          onClick={(e) => setCurrentAccion("Consultar")}
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
                  <td>{record.numEspacio}</td>
                  <td>{record.estado}</td>
                  <td>{record.tipoEspacio}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            setAccion("Eliminar");
                            setValues((prevApartamento) => ({
                              ...prevApartamento,
                              NumeroEspacio: record.numEspacio,
                            }));
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
                            setValues((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.numEspacio,
                              TipoEspacio: record.tipoEspacio,
                              Estado: record.estado,
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
                  <td>{record.numEspacio}</td>
                  <td>{record.estado}</td>
                  <td>{record.tipoEspacio}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => {
                              setAccion("Eliminar");
                              setValues((prevApartamento) => ({
                                ...prevApartamento,
                                NumeroEspacio: record.numEspacio,
                              }));
                            }}
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
                            setValues((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: record.numEspacio,
                              TipoEspacio: record.tipoEspacio,
                              Estado: record.estado,
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
            class={
              accion === "Actualizar" || accion === "Insertar"
                ? "modal fade"
                : "modal fade z-n1"
            }
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
                    {accion === "Actualizar" ? (
                      ""
                    ) : (
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
                          value={values.NumeroEspacio}
                          onChange={(e) =>
                            setValues((prevParqueadero) => ({
                              ...prevParqueadero,
                              NumeroEspacio: e.target.value,
                            }))
                          }
                        />
                        {errors.NumeroEspacio && (
                          <span className="text-danger">
                            {errors.NumeroEspacio}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Tipo de Espacio
                      </label>
                      <select
                        id="exampleInputPassword1"
                        className="form-select me-5"
                        aria-label="Default select example"
                        onChange={(e) =>
                          setValues((prevParqueadero) => ({
                            ...prevParqueadero,
                            TipoEspacio: e.target.value,
                          }))
                        }
                      >
                        <option selected>Seleccione un tipo de espacio</option>
                        <option value={"Moto"}>Moto</option>
                        <option value={"Carro"}>Carro</option>
                      </select>
                      {errors.TipoEspacio && (
                        <span className="text-danger">
                          {errors.TipoEspacio}
                        </span>
                      )}
                    </div>
                    {accion === "Actualizar" ? (
                      <div className="mb-3">
                        <label
                          htmlFor="exampleInputPassword1"
                          className="form-label"
                        >
                          Estado
                        </label>
                        <select
                          id="exampleInputPassword1"
                          className="form-select me-5"
                          aria-label="Default select example"
                          onChange={(e) =>
                            setValues((prevParqueadero) => ({
                              ...prevParqueadero,
                              Estado: e.target.value,
                            }))
                          }
                        >
                          <option selected>Seleccione un estado</option>
                          <option value={"Disponible"}>Disponible</option>
                          <option value={"Ocupado"}>Ocupado</option>
                        </select>
                      </div>
                    ) : (
                      ""
                    )}
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
                          : "btn btn-primary w-25 m-0 ms-1 h-100"
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
            <th colSpan="3" className="sorting text-light bg-dark"></th>
            <th rowSpan="1" colSpan="1" className="sorting text-light bg-dark">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setValues((prevReuniones) => ({
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
