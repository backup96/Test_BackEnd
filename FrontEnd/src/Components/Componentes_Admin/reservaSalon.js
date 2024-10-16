import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

library.add(faTrash);
library.add(faPenToSquare);
library.add(faXmark);
library.add(faCheck);

const ReservaSalon = ({ currentRecords, length, apiS }) => {
  const [accion, setAccion] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState("");
  const [eliminarRecord, setEliminarRecord] = useState("");

  const [salonComunal, setSalonComunal] = useState({
    id: "",
    Nombre: "",
    NumeroDocumento: "",
    Telefono: "",
    CodigoVivienda: "",
    HoraInicio: "",
    HoraFin: "",
    Motivo: "",
    Fecha: "",
  });

  const enviar = async (e) => {
    e.preventDefault();
    try {
      if (accion === "Actualizar") {
        if (salonComunal.id) {
          const response = await axios.patch(
            `http://localhost:4000/${apiS}/${salonComunal.id}`,
            {
              id: salonComunal.id,
              Nombre: salonComunal.Nombre,
              NumeroDocumento: salonComunal.NumeroDocumento,
              Telefono: salonComunal.Telefono,
              CodigoVivienda: salonComunal.CodigoVivienda,
              HoraInicio: salonComunal.HoraInicio,
              HoraFin: salonComunal.HoraFin,
              Motivo: salonComunal.Motivo,
              Fecha: salonComunal.Fecha,
            }
          );
          if (response.status === 200) {
            setStatus(response.status);
            setAccion("");
            setTimeout(() => {
              setStatus("");
            }, 5000);
            setSalonComunal((prevUsuario) => ({
              ...prevUsuario,
              id: "",
            }));
          }
        }
      } else if (accion === "Eliminar") {
        if (salonComunal.id) {
          const response = await axios.delete(
            `http://localhost:4000/${apiS}/${salonComunal.id}`
          );
          if (response.status === 200) {
            setShowAlert(false);
            setStatus(response.status);
            setAccion("");
            setTimeout(() => {
              setStatus("");
            }, 5000);
          }
        } else {
          setShowAlert(false);
        }
      } else if (accion === "Insertar") {
        const response1 = await axios.post(
          `http://localhost:4000/ReservaSalon`,
          {
            id: salonComunal.id,
            Nombre: salonComunal.Nombre,
            NumeroDocumento: salonComunal.NumeroDocumento,
            Telefono: salonComunal.Telefono,
            CodigoVivienda: salonComunal.CodigoVivienda,
            HoraInicio: salonComunal.HoraInicio,
            HoraFin: salonComunal.HoraFin,
            Motivo: salonComunal.Motivo,
            Fecha: salonComunal.Fecha,
          }
        );
        if (response1.status === 201) {
          setStatus(response1.status);
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

  const eliminar = (record) => {
    if (apiS === "ReservaSalon") {
      setSalonComunal((prevSalon) => ({
        ...prevSalon,
        id: record,
      }));
    }
    setAccion(() => "Eliminar");
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
      <div className="accordion" id="accordionExample">
        {length === 0 ? (
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#collapse"}
                aria-expanded="false"
                aria-controls={"collapse"}
              >
                No hay solicitudes
              </button>
            </h2>
            <div
              id={"collapse"}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            ></div>
          </div>
        ) : (
          currentRecords.map((record, index) => (
            <div key={index} class="card p-0">
              <div class="card-body p-2">
                <div className="d-flex flex-row justify-content-start align-items-center">
                  <div className="w-75">
                    <ul class="list-group list-group-flush">
                      <li class="list-group-item text-start">
                        <span className="fw-bold">{record.Nombre}</span> de la
                        casa{" "}
                        <span className="fw-bold">{record.CodigoVivienda}</span>{" "}
                        ha rentado el salon comunal
                      </li>
                      <li class="list-group-item text-start">
                        Dia: <span className="fw-bold">{record.Fecha}</span>
                      </li>
                      <li class="list-group-item text-start">
                        Hora de inicio:{" "}
                        <span className="fw-bold">{record.HoraInicio}</span>
                      </li>
                      <li class="list-group-item text-start">
                        Hora de finalización:{" "}
                        <span className="fw-bold">{record.HoraFin}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="w-25">
                    <button
                      onClick={() => {
                        setShowAlert(true);
                        setEliminarRecord(record.id);
                      }}
                      class="btn btn-danger"
                    >
                      <FontAwesomeIcon icon={faTrash} className="fs-1" />
                    </button>
                  </div>
                  <div className="w-25">
                    <button
                      type="button"
                      class="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() =>
                        setSalonComunal((prevUsuario) => ({
                          ...prevUsuario,
                          id: record.id,
                          Nombre: record.Nombre,
                          NumeroDocumento: record.NumeroDocumento,
                          Telefono: record.Telefono,
                          CodigoVivienda: record.CodigoVivienda,
                          HoraInicio: record.HoraInicio,
                          HoraFin: record.HoraFin,
                          Motivo: record.Motivo,
                          Fecha: record.Fecha,
                        }))
                      }
                    >
                      <FontAwesomeIcon icon={faPenToSquare} className="fs-1" />
                    </button>
                    {/* Modal de actualización */}
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
                              {accion} Solicitud de salon comunal
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
                                  value={salonComunal.Nombre}
                                  onChange={(e) =>
                                    setSalonComunal((prevUsuario) => ({
                                      ...prevUsuario,
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
                                  Número de documento
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={salonComunal.NumeroDocumento}
                                  onChange={(e) =>
                                    setSalonComunal((prevUsuario) => ({
                                      ...prevUsuario,
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
                                  value={salonComunal.Telefono}
                                  onChange={(e) =>
                                    setSalonComunal((prevUsuario) => ({
                                      ...prevUsuario,
                                      Telefono: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Código de vivienda
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={salonComunal.CodigoVivienda}
                                  onChange={(e) =>
                                    setSalonComunal((prevUsuario) => ({
                                      ...prevUsuario,
                                      CodigoVivienda: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <div className="d-flex flex-row justify-content-around">
                                  <div>
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Hora de inicio
                                    </label>
                                    <input
                                      type="time"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={salonComunal.HoraInicio}
                                      onChange={(e) =>
                                        setSalonComunal((prevUsuario) => ({
                                          ...prevUsuario,
                                          HoraInicio: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label
                                      htmlFor="exampleInputPassword1"
                                      className="form-label"
                                    >
                                      Hora de finalización
                                    </label>
                                    <input
                                      type="time"
                                      className="form-control"
                                      id="exampleInputPassword1"
                                      required
                                      value={salonComunal.HoraFin}
                                      onChange={(e) =>
                                        setSalonComunal((prevUsuario) => ({
                                          ...prevUsuario,
                                          HoraFin: e.target.value,
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="mb-3">
                                <label
                                  htmlFor="exampleInputPassword1"
                                  className="form-label"
                                >
                                  Dia
                                </label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="exampleInputPassword1"
                                  required
                                  value={salonComunal.Fecha}
                                  onChange={(e) =>
                                    setSalonComunal((prevUsuario) => ({
                                      ...prevUsuario,
                                      Fecha: e.target.value,
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
                                onClick={() => setCurrentAccion("Actualizar")}
                              >
                                Guardar cambios
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ReservaSalon;
