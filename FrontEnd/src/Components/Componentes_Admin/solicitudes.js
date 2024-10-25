import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Solicitudes = ({ currentRecords, length }) => {
  const [data, setDatos] = useState({
    Nombre: "",
    Apellido: "",
    Teléfono: "",
    NumeroDocumento: "",
    Correo: "",
    CodigoVivienda: ""
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post("/admin/confirmAcc", data)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Cuenta creada correctamente");
        } else {
          toast.error("Ocurrio un error al intentar crear la cuenta");
        }
      })
      .catch((err) => console.log(err));
  };

   const handleDelete = (event) => {
     event.preventDefault();
     axios
       .post("/admin/cancelAcc", data)
       .then((res) => {
         if (res.status === 200) {
           toast.success("Solicitud cancelada correctamente");
         } else {
           toast.error("Ocurrio un error al cancelar la cuenta");
         }
       })
       .catch((err) => console.log(err));
   };

  return (
    <div className="accordion" id="accordionExample">
      <ToastContainer />
      {length === 0 ? (
        <div className="accordion-item mb-3">
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
          <div key={index} className="accordion-item mb-3">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={"#collapse" + index}
                aria-expanded="false"
                aria-controls={"collapse" + index}
              >
                Solicitud de creación de cuenta número {index + 1}
              </button>
            </h2>
            <div
              id={"collapse" + index}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionExample"
            >
              <div className="d-flex flex-column">
                <div className="w-100">
                  <div className="accordion-body">
                    <ul className="list-group">
                      <li className="list-group-item">{`Nombre: ${record.Nombre} ${record.Apellido}`}</li>
                      <li className="list-group-item">{`Número de documento: ${record.NumDocumento}`}</li>
                      <li className="list-group-item">{`Teléfono: ${record.Tel}`}</li>
                      <li className="list-group-item">{`Correo: ${record.Correo}`}</li>
                      <li className="list-group-item">{`Código de vivienda: ${record.CodVivienda}`}</li>
                    </ul>
                  </div>
                </div>
                <div className="d-flex flex-row justify-content-end">
                  <form onSubmit={handleDelete} className="mx-2 my-2">
                    <button
                      onClick={() =>
                        setDatos((prevUsuario) => ({
                          ...prevUsuario,
                          NumeroDocumento: record.NumDocumento,
                        }))
                      }
                      type="submit"
                      className="btn bg-danger-subtle border border-danger text-danger"
                    >
                      Cancelar
                    </button>
                  </form>
                  <a
                    href={`http://localhost:8081/admin/descargar/${record.idSolicitud}`}
                    download={`certificado ${record.Nombre} ${record.Apellido}`}
                    className="btn mx-2 my-2 bg-primary-subtle border border-primary text-primary"
                  >
                    Ver documento de verificación
                  </a>

                  <form className="mx-2 my-2" onSubmit={handleSubmit}>
                    <button
                      onClick={() =>
                        setDatos((prevUsuario) => ({
                          ...prevUsuario,
                          Nombre: record.Nombre,
                          Apellido: record.Apellido,
                          Teléfono: record.Tel,
                          NumeroDocumento: record.NumDocumento,
                          Correo: record.Correo,
                          CodigoVivienda: record.CodVivienda,
                        }))
                      }
                      type="submit"
                      className="btn btn-success m-0"
                    >
                      Aprobar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Solicitudes;
