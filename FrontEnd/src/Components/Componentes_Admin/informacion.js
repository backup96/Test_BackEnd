import axios from "axios";
import { useState } from "react";

const Info = ({ currentRecords, apiS, data }) => {
  const [text, setText] = useState({
    text: "",
  });

  const enviar = async (e) => {
    e.preventDefault();
    currentRecords.map((item) =>
      handleSend({
        correo: item.correo,
        nombre: `${item.nombre} ${item.apellido}`,
        codVivi: item.codigoVivienda,
        codPer: item.numDocumento,
        numPar: item.idParqueaderoFk,
      })
    );
  };

  const enviarCircular = async (e) => {
    e.preventDefault();
    currentRecords.map((item) =>
      handleSend2({ correo: item.correo, text: text.text })
    );
  };

  const handleSend = (data) => {
    console.log(data);
    axios
      .post("/admin/sendInformacion", data)
      .then((res) => {
        if (res.status === 200) {
          console.log("Correos enviados");
        } else {
          console.log("Correos no enviados");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSend2 = (data) => {
    console.log(data);
    axios
      .post("/admin/sendCircularInformacion", data)
      .then((res) => {
        if (res.status === 200) {
          console.log("Circulares enviados");
        } else {
          console.log("Correos no enviados");
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex flex-column w-100 h-50">
      <div className=" d-flex flex-column justify-content-end">
        <div className="d-flex flex-column justify-content-start">
          <label
            htmlFor="exampleInputEmail1"
            className=" text-start form-label"
          >
            Circular
          </label>
          <textarea
            placeholder="Lo que escriba aquí siempre empezará con la frase: 
            'Un cordial saludo residentes de Torres de Santa Isabel. 
            El presente correo es para informar que (Su mensaje)'. 
            Así mismo finalizará con: 
            'Agradecemos su atención a esta circular y quedamos atentos a cualquier duda o comentario.
            Atentamente,
            Administración del Conjunto Residencial Torres de Santa Isabel'"
            className="form-control "
            id="exampleFormControlTextarea1"
            rows="7"
            name="CircularBody"
            onChange={(e) => setText({ ...text, text: e.target.value })}
          ></textarea>
        </div>
        <div className="d-flex justify-content-end my-3">
          <form onSubmit={enviarCircular}>
            <button
              type="submit"
              className="btn mx-2 bg-primary-subtle border border-primary text-primary p-2"
            >
              Enviar Circular
            </button>
          </form>

          <form onSubmit={enviar}>
            <button type="submit" className="btn btn-success mx-3 ">
              Enviar Recibo de Administración
            </button>
          </form>
        </div>
      </div>
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
              <td>{record.correo}</td>
              <td>
                {record.EstadoEnvio === "No enviado" ? (
                  <button
                    // onClick={(e) => {
                    //   reenviar(record.id);
                    //   enviar(e);
                    // }}
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
        </tbody>
      </table>
    </div>
  );
};
export default Info;
