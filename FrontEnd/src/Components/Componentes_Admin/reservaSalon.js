import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ValidationReg from "../../Components/Componentes_Validaciones/ValidationReg";
import { ToastContainer, toast } from "react-toastify";

library.add(faTrash);
library.add(faPenToSquare);
library.add(faXmark);
library.add(faCheck);

const ReservaSalon = ({ currentRecords, length, apiS }) => {
  const [accion, setAccion] = useState("");
  const [errors, setError] = useState({});
  const [status, setStatus] = useState("");
  const data2 = "";

  const [values, setValues] = useState({
    Nombre: "",
    Apellido: "",
    CodigoVivienda: "",
    Dia: "",
    DiaOld: "",
    HoraInicio: "",
    HoraFin: "",
    NumDocumento: "",
  });

  useEffect(() => {
    if (accion === "Eliminar") {
      eliminar(values.DiaOld);
    }
  }, [accion]);

  const customToast = (mess) => {
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

  const enviar = (e) => {
    e.preventDefault();
    console.log(values, accion);
    const validationErrors = ValidationReg(values, currentRecords, data2, apiS);
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
                toast.success("Cita actualizada correctamente");
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
    console.log(errors);
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

  return (
    <>
      <ToastContainer />
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
            <>
              <div key={index} class="card p-0">
                <div class="card-body p-2">
                  <div className="d-flex flex-row justify-content-start align-items-center">
                    <div className="w-75">
                      <ul class="list-group list-group-flush">
                        <li class="list-group-item text-start">
                          <span className="fw-bold">{`${record.nombre} ${record.apellido}`}</span>{" "}
                          de la casa{" "}
                          <span className="fw-bold">
                            {record.Apartamento_FK}
                          </span>{" "}
                          ha rentado el salon comunal
                        </li>
                        <li class="list-group-item text-start">
                          Dia: <span className="fw-bold">{record.Fecha}</span>
                        </li>
                        <li class="list-group-item text-start">
                          Hora de inicio:{" "}
                          <span className="fw-bold">
                            {record.horarioInicio}
                          </span>
                        </li>
                        <li class="list-group-item text-start">
                          Hora de finalización:{" "}
                          <span className="fw-bold">{record.horarioFin}</span>
                        </li>
                      </ul>
                    </div>
                    <div className="w-25">
                      <button
                        onClick={() => {
                          setAccion("Eliminar");
                          setValues((prevApartamento) => ({
                            ...prevApartamento,
                            DiaOld: record.Fecha.slice(0, 10),
                          }));
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
                        onClick={() => {
                          setValues((prevUsuario) => ({
                            ...prevUsuario,
                            Nombre: record.nombre,
                            Apellido: record.apellido,
                            CodigoVivienda: record.Apartamento_FK,
                            Dia: "",
                            DiaOld: record.Fecha.slice(0, 10),
                            HoraInicio: record.horarioInicio,
                            HoraFin: record.horarioFin,
                            NumDocumento: record.numDocumento,
                          }));
                          setCurrentAccion("Actualizar");
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="fs-1"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ))
        )}
        {/* Modal de actualización */}
        <div
          className={accion === "Actualizar" ? "modal fade" : "modal fade z-n1"}
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog w-75 p-0 rounded-4">
            <div class="modal-content w-100">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">
                  {accion} cita de salon
                </h1>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              {errors.HoraInicio && (
                <span className="text-danger">{errors.HoraInicio}</span>
              )}
              <form onSubmit={enviar}>
                <div class="modal-body">
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
                          value={values.HoraInicio}
                          onChange={(e) =>
                            setValues((prevUsuario) => ({
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
                          value={values.HoraFin}
                          onChange={(e) =>
                            setValues((prevUsuario) => ({
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
                      onChange={(e) =>
                        setValues((prevUsuario) => ({
                          ...prevUsuario,
                          Dia: e.target.value,
                        }))
                      }
                    />
                    {errors.Dia && (
                      <span className="text-danger">{errors.Dia}</span>
                    )}
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    data-bs-dismiss={accion === "" ? "modal" : ""}
                    type="submit"
                    className="btn btn-warning"
                    onClick={() => setCurrentAccion("Actualizar")}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservaSalon;
