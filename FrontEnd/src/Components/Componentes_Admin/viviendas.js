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
import { useState, useEffect } from "react";
import axios from "axios";

library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);
library.add(faXmark);
library.add(faCheck);

const Vivienda = ({ item, currentRecords, apiS, data }) => {
  const [accion, setAccion] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setError] = useState({});
  const [values, setValues] = useState({
    Bloque: "",
    Torre: "",
    numAprt: "",
    codApt: "",
  });

  useEffect(() => {
    if (accion === "Eliminar") {
      eliminar(values.codigoVivienda);
    }
  }, [accion]);

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

  const [searchTerm, setSearchTerm] = useState({
    Term: "",
  }); // Estado para el término de búsqueda

  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const enviar = (e) => {
    e.preventDefault();
    const validationErrors = ValidationReg(values, data, apiS);
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
                toast.success("Apartamento actualizado correctamente");
              } else if (res.status === 500) {
                toast.error("Ocurrio un error al actualizar el apartamento");
              }
            })
            .catch((err) => toast.error(""));
        } else if (accion === "Insertar") {
          axios
            .post(`/admin/post${apiS}`, values)
            .then((res) => {
              if (res.data.Status === "Success") {
                toast.success("Apartamento insertado correctamente");
              } else {
                toast.error("Ocurrio un error al insertar el apartamento");
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
    console.log(errors, accion);
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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `/admin/getApartamentosEsp`,
        searchTerm
      );
      if (response.status === 200) {
        setFilteredRecords(response.data);
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
          <label className="text-start w-100 fw-normal" for="searchParam">
            Buscar por código de vivienda
          </label>
          <input
            id="searchParam"
            className="form-control me-2"
            type="search"
            placeholder="Ejemplo -> 1103"
            aria-label="Search"
            required
            onChange={(e) =>
              setSearchTerm({ ...searchTerm, Term: e.target.value })
            }
          />
        </div>
        <button
          onClick={(e) => setCurrentAccion("Consultar")}
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
                className="sorting text-light bg-dark"
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
              className="sorting text-light bg-dark"
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
                  <td>{record.codigoVivienda}</td>
                  <td>{record.bloque}</td>
                  <td>{record.numApartamento}</td>
                  <td>{record.torre}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <button
                          onClick={() => {
                            setAccion("Eliminar");
                            setValues((prevApartamento) => ({
                              ...prevApartamento,
                              codApt: record.codigoVivienda,
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
                            setValues((prevApartamento) => ({
                              ...prevApartamento,
                              Bloque: record.bloque,
                              Torre: record.torre,
                              numAprt: record.numApartamento,
                              codApt: record.codigoVivienda,
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
                  <td>{record.codigoVivienda}</td>
                  <td>{record.bloque}</td>
                  <td>{record.numApartamento}</td>
                  <td>{record.torre}</td>
                  <td>
                    <div className="d-flex flex-row justify-content-center">
                      <div className="mx-2">
                        <form className="p-0" onSubmit={enviar}>
                          <button
                            onClick={() => {
                              setAccion("Eliminar");
                              setValues((prevApartamento) => ({
                                ...prevApartamento,
                                codApt: record.codigoVivienda,
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
                            setValues((prevApartamento) => ({
                              ...prevApartamento,
                              Bloque: record.bloque,
                              Torre: record.torre,
                              numAprt: record.numApartamento,
                              codApt: record.codigoVivienda,
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
            <div class="modal-dialog p-0 bg-transparent w-75">
              <div class="modal-content w-100">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Apartamentos
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
                    {errors.CodigoVivienda && (
                      <span className="text-danger">
                        {errors.CodigoVivienda}
                      </span>
                    )}
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Bloque
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputEmail1"
                        value={values.Bloque}
                        onChange={(e) =>
                          setValues((prevApartamento) => ({
                            ...prevApartamento,
                            Bloque: e.target.value,
                          }))
                        }
                      />
                      {errors.Bloque && (
                        <span className="text-danger">{errors.Bloque}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Torre
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={values.Torre}
                        onChange={(e) =>
                          setValues((prevApartamento) => ({
                            ...prevApartamento,
                            Torre: e.target.value,
                          }))
                        }
                      />
                      {errors.Torre && (
                        <span className="text-danger">{errors.Torre}</span>
                      )}
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="exampleInputPassword1"
                        className="form-label"
                      >
                        Numero de apartamento
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="exampleInputPassword1"
                        value={values.numAprt}
                        onChange={(e) =>
                          setValues((prevApartamento) => ({
                            ...prevApartamento,
                            numAprt: e.target.value,
                          }))
                        }
                      />
                      {errors.numAprt && (
                        <span className="text-danger">{errors.numAprt}</span>
                      )}
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
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
            <th colSpan="4" className="text-light bg-dark"></th>
            <th rowSpan="1" colSpan="1" className="text-light bg-dark">
              <button
                type="button"
                className="btn btn-success p-0 m-0 w-50"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  setValues((prevApartamento) => ({
                    ...prevApartamento,
                    Bloque: "",
                    Torre: "",
                    numAprt: "",
                    codApt: "",
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

export default Vivienda;
