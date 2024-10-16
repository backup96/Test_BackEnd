import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Solicitudes from "./solicitudes";
import ReservaSalon from "./reservaSalon";
import Vivienda from "./viviendas";
import Propietario from "./propietarios";
import Parqueadero from "./parqueadero";
import Invitados from "./invitados";
import Reunion from "./reuniones";
import Porteros from "./porteros";
import Info from "./informacion";
import Reporte from "./reporte";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

const Tabla = ({ item, apiS }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 7;
  // Datos de ejemplo
  const [data, setDatos] = useState([]);

  useEffect(() => {
    async function fetchApartamentos() {
      try {
        if (apiS === "Informacion" || apiS === "Reporte") {
          const response = await axios.get(
            `http://localhost:4000/Propietarios`
          );
          setDatos(response.data);
          if (response.data.length === 0) {
            setDatos([]);
          }
        } else {
          const response = await axios.get(`http://localhost:4000/${apiS}`);
          setDatos(response.data);

          if (response.data.length === 0) {
            setDatos([]);
          }
        }
      } catch (error) {
        console.error("Error al obtener los apartamentos:", error);
      }
    }

    fetchApartamentos();
  }, [apiS]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  // Cálculo del total de páginas
  const totalPages = Math.ceil(data.length / recordsPerPage);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-100 h-100" style={{ marginLeft: "3%" }}>
      <div className="card m-0 h-100">
        <div className="card-body">
          <div
            id="example2_wrapper"
            className="dataTables_wrapper dt-bootstrap4"
          >
            {apiS === "Solicitudes" ? (
              <Solicitudes
                currentRecords={currentRecords}
                length={data.length}
              />
            ) : apiS === "ReservaSalon" ? (
              <ReservaSalon
                currentRecords={currentRecords}
                length={data.length}
                apiS={apiS}
              />
            ) : apiS === "Apartamentos" ? (
              <Vivienda
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Propietarios" ? (
              <Propietario
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Parqueadero" ? (
              <Parqueadero
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Invitados" ? (
              <Invitados
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Reuniones" ? (
              <Reunion
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Porteros" ? (
              <Porteros
                item={item}
                currentRecords={currentRecords}
                apiS={apiS}
              />
            ) : apiS === "Informacion" ? (
              <Info currentRecords={currentRecords} apiS={apiS} />
            ) : apiS === "Reporte" ? (
              <Reporte item={item} currentRecords={data} apiS={apiS} />
            ) : null}

            {apiS !== "Reporte" ? (
              <div className="row">
                <div className="col-sm-12 col-md-5">
                  <div
                    className="dataTables_info"
                    id="example2_info"
                    role="status"
                    aria-live="polite"
                  >
                    Mostrando {indexOfFirstRecord + 1} a{" "}
                    {indexOfLastRecord > data.length
                      ? data.length
                      : indexOfLastRecord}{" "}
                    de {data.length} registros
                  </div>
                </div>
                <div className="col-sm-12 col-md-7">
                  <div
                    className="dataTables_paginate paging_simple_numbers"
                    id="example2_paginate"
                  >
                    <ul className="pagination">
                      <li
                        className={`paginate_button page-item previous ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                        id="example2_previous"
                      >
                        <Link
                          onClick={() => handlePageChange(currentPage - 1)}
                          href="#"
                          aria-controls="example2"
                          data-dt-idx="0"
                          tabIndex="0"
                          className="page-link"
                        >
                          <FontAwesomeIcon icon={faAnglesLeft} />
                        </Link>
                      </li>
                      {[...Array(totalPages)].map((_, index) => (
                        <li
                          key={index}
                          className={`paginate_button page-item ${
                            currentPage === index + 1 ? "active" : ""
                          }`}
                        >
                          <button
                            onClick={() => handlePageChange(index + 1)}
                            className="page-link"
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`paginate_button page-item next ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                        id="example2_next"
                      >
                        <Link
                          onClick={() => handlePageChange(currentPage + 1)}
                          href="#"
                          aria-controls="example2"
                          data-dt-idx="7"
                          tabIndex="0"
                          className="page-link"
                        >
                          <FontAwesomeIcon icon={faAnglesRight} />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabla;
