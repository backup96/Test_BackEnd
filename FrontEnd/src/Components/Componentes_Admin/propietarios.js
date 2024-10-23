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
import { ToastContainer, toast } from "react-toastify";
import ValidationReg from "../../Components/Componentes_Validaciones/ValidationReg";

/* Añadir iconos a la libraria */
library.add(faTrash);
library.add(faPenToSquare);
library.add(faSquarePlus);
library.add(faXmark);
library.add(faCheck);

const Propietario = ({ item, currentRecords, apiS, data }) => {
  const [accion, setAccion] = useState("");
  const [errors, setError] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");

  const [values, setValues] = useState({
    Nombre: "",
    Apellido: "",
    Teléfono: "",
    NumeroDocumento: "",
    Correo: "",
    CodigoVivienda: "",
    EspacioParqueadero: "",
    Placa: "",
  });

  const [searchTerm, setSearchTerm] = useState({
    Term: "",
  }); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);

  const enviar = async (e) => {
    e.preventDefault();
    const validationErrors = ValidationReg(values, data, apiS);
    setError(validationErrors);
    if (
      Object.keys(validationErrors).length === 1 &&
      validationErrors.Valid === "valid"
    ) {
      try {
        if (accion === "Actualizar") {
          // axios
          //   .post(`/admin/patch${apiS}`, values)
          //   .then((res) => {
          //     console.log(res.status);
          //     if (res.data.Status === "Success") {
          //       toast.success("Propietario actualizado correctamente");
          //     } else if (res.status === 500) {
          //       toast.error("Ocurrio un error al actualizar el registro");
          //     }
          //   })
          //   .catch((err) => toast.error(""));
        } else if (accion === "Eliminar") {
          if (values.id) {
            const response = await axios.delete(
              `http://localhost:4000/${apiS}/${values.id}`
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
          console.log(values);
          axios
            .post(`/admin/post${apiS}`, values)
            .then((res) => {
              if (res.data.Status === "Success") {
                toast.success("Propietario insertado correctamente");
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
  };

  const setCurrentAccion = (accion) => {
    setAccion(() => accion);
  };

  const eliminar = (record) => {
    if (apiS === "values") {
      setValues((prevSalon) => ({
        ...prevSalon,
        id: record,
      }));
    }
    setAccion(() => "Eliminar");
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/admin/getPropietarioEsp`, searchTerm);
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
            Buscar por número de identidad
          </label>
          <input
            id="searchParam"
            className="form-control me-2"
            type="search"
            placeholder="Ejemplo -> 1056798564"
            aria-label="Search"
            required
            onChange={(e) =>
              setSearchTerm({ ...searchTerm, Term: e.target.value })
            }
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
                  <td>{record.codigoVivienda}</td>
                  <td>{`${record.nombre} ${record.apellido}`}</td>
                  <td>{record.telefono}</td>
                  <td>{record.correo}</td>
                  <td>{record.numDocumento}</td>
                  <td>{record.idParqueaderoFk}</td>
                  <td>{record.placaVehiculo}</td>
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
                            setValues((prevPropietario) => ({
                              ...prevPropietario,
                              Nombre: record.nombre,
                              Apellido: record.apellido,
                              Teléfono: record.telefono,
                              NumeroDocumento: record.numDocumento,
                              Correo: record.correo,
                              CodigoVivienda: record.codigoVivienda,
                              EspacioParqueadero: record.idParqueaderoFk,
                              Placa: record.placaVehiculo,
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
                  <td>{`${record.nombre} ${record.apellido}`}</td>
                  <td>{record.telefono}</td>
                  <td>{record.correo}</td>
                  <td>{record.numDocumento}</td>
                  <td>{record.idParqueaderoFk}</td>
                  <td>{record.placaVehiculo}</td>
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
                            setValues((prevPropietario) => ({
                              ...prevPropietario,
                              CodigoVivienda: record.CodigoVivienda,
                              Nombre: record.Nombre,
                              Teléfono: record.Teléfono,
                              Correo: record.Correo,
                              NumeroDocumento: record.NumeroDocumento,
                              MesesAtrasados: record.MesesAtrasados,
                              EspacioParqueadero: record.EspacioParqueadero,
                              User: record.User,
                              Pass: record.Pass,
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
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog w-50 p-0 rounded rounded-4">
              <div className="modal-content mx-0 my-5 w-100">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">
                    {accion} Propietario
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
                            required
                            disabled={accion === "Actualizar" ? true : false}
                            value={values.Nombre}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
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
                            value={values.Teléfono}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                Teléfono: e.target.value,
                              }))
                            }
                          />
                          {errors.Teléfono && (
                            <span className="text-danger">
                              {errors.Teléfono}
                            </span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Correo
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={values.Correo}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                Correo: e.target.value,
                              }))
                            }
                          />
                          {errors.Correo && (
                            <span className="text-danger">{errors.Correo}</span>
                          )}
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Placa
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={values.Placa}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                Placa: e.target.value,
                              }))
                            }
                          />
                          {errors.Correo && (
                            <span className="text-danger">{errors.Correo}</span>
                          )}
                        </div>
                      </div>
                      <div>
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
                            required
                            disabled={accion === "Actualizar" ? true : false}
                            value={values.Apellido}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                Apellido: e.target.value,
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
                            disabled={accion === "Actualizar" ? true : false}
                            value={values.NumeroDocumento}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                NumeroDocumento: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputEmail1"
                            className="form-label"
                          >
                            Codigo de Vivienda
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputEmail1"
                            required
                            value={values.CodigoVivienda}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                CodigoVivienda: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label
                            htmlFor="exampleInputPassword1"
                            className="form-label"
                          >
                            Espacio de Parqueadero
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="exampleInputPassword1"
                            required
                            value={values.EspacioParqueadero}
                            onChange={(e) =>
                              setValues((prevPropietario) => ({
                                ...prevPropietario,
                                EspacioParqueadero: e.target.value,
                              }))
                            }
                          />
                        </div>
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
            <th colSpan="7" className="sorting text-light bg-dark"></th>
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
                    Teléfono: "",
                    NumeroDocumento: "",
                    Correo: "",
                    CodigoVivienda: "",
                    NumParqueadero: "",
                    EspacioParqueadero: "",
                    Placa: "",
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

export default Propietario;
