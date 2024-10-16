import axios from "axios";
import { useState } from "react";

const Info = ({ currentRecords, apiS, data }) => {
  const [estado, setEstado] = useState("");
  const [status, setStatus] = useState("");

  const [propietarios, setPropietarios] = useState({
    EstadoEnvio: "",
    id: "",
  });

  const enviar = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:4000/Propietarios`);
      const item = response.data;
      const slice = item.slice(0, (item.length/2));
      if (estado === "Normal") {
        const update = item.map((item) => {
          return axios.patch(`http://localhost:4000/Propietarios/${item.id}`, {
            EstadoEnvio: "Enviado",
          });
        });
        const badUpdate = slice.map((item) => {
          return axios.patch(`http://localhost:4000/Propietarios/${item.id}`, {
            EstadoEnvio: "No enviado",
          });
        });

        if (update && badUpdate) {
          setStatus(response.status);
           setTimeout(() => {
             setStatus("");
           }, 5000);
        }
      } else if (estado === "Reenviar") {
        const response = await axios.patch(
          `http://localhost:4000/Propietarios/${propietarios.id}`,
          {
            EstadoEnvio: "Enviado",
          }
        );
        if (response.status === 200) {
           setStatus(response.status);
           setTimeout(() => {
             setStatus("");
           }, 5000);
          setPropietarios((prevUsuario) => ({
            ...prevUsuario,
            id: "",
          }));
        }
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al realizar la operación");
    }
  };

  const reenviar = (record) => {
    setPropietarios((prevSalon) => ({
      ...prevSalon,
      id: record,
    }));
    setEstado(() => "Reenviar");
  };

  return (
    <div className="d-flex flex-column w-100 h-50">
      {status === 200 ? (
        <div className="d-flex justify-content-center">
          <div
            className="alert alert-success alert-dismissible z-1 position-absolute fade show w-25 text-center"
            role="alert"
            style={{ marginInlineEnd: "35%" }}
          >
            Correos enviados
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
      <form className=" w-100 mb-2">
        <div className=" d-flex flex-column justify-content-end">
          <div className="d-flex flex-column justify-content-start">
            <label
              htmlFor="exampleInputEmail1"
              className=" text-start form-label"
            >
              Circular
            </label>
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
              name="CircularBody"
            ></textarea>
          </div>
          <div className="d-flex justify-content-end my-3">
            <button
              onClick={(e) => {
                enviar(e);
                setEstado("Normal");
              }}
              className="btn btn-primary mx-3"
            >
              Enviar Circular
            </button>
            <button
              onClick={(e) => {
                enviar(e);
                setEstado("Normal");
              }}
              className="btn btn-primary "
            >
              Enviar Recibo de Administración
            </button>
          </div>
        </div>
      </form>
      <table
        id="example2"
        className="table table-bordered table-hover dataTable dtr-inline mb-3"
        aria-describedby="example2_info"
      >
        <thead>
          <tr>
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="example2"
              rowSpan="1"
              colSpan="1"
              aria-label="Rendering engine: activate to sort column ascending"
            >
              Correos
            </th>
            <th
              className="sorting"
              tabIndex="0"
              aria-controls="example2"
              rowSpan="1"
              colSpan="1"
              aria-label="Platform(s): activate to sort column ascending"
            >
              Estado de envío
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((record, index) => (
            <tr
              key={index}
              className={
                record.EstadoEnvio === "Enviado"
                  ? "table-success"
                  : record.EstadoEnvio === "No enviado"
                  ? "table-danger"
                  : "table-warning"
              }
            >
              <td>{record.Correo}</td>
              <td>
                {record.EstadoEnvio === "No enviado" ? (
                  <button
                    onClick={(e) => {
                      reenviar(record.id);
                      enviar(e);
                    }}
                    type="submit"
                    class="btn btn-danger px-2"
                  >
                    Volver a enviar
                  </button>
                ) : (
                  record.EstadoEnvio
                )}
              </td>
            </tr>
          ))}
          <div
            class="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          ></div>
        </tbody>
      </table>
    </div>
  );
};
export default Info;
