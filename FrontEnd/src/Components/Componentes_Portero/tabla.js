import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import Propietario from "./propietarios";
import Parqueadero from "./parqueadero";
import Invitados from "./invitados";
import { faAnglesRight, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

const TableContext = createContext();

const Tabla = ({ item, apiS }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;
  const [data, setDatos] = useState([]);
  const [dataApart, setDatosApart] = useState([]);
  const [dataEsp, setdataEsp] = useState([]);

  useEffect(() => {
    const fetchApartamentos = async () => {
      try {
        const url = apiS === "Informacion" || apiS === "Reporte"
          ? "http://localhost:4000/Propietarios"
          : `/admin/get${apiS}`;
        const response = await axios.get(url);
        setDatos(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };
    fetchApartamentos();
  }, [apiS]);

  useEffect(() => {
    const fetchDataApartamentos = async () => {
      try {
        const response = await axios.get(`/public/Apartamentos`);
        setDatosApart(response.data);
      } catch (error) {
        console.error("Error al obtener los apartamentos:", error);
      }
    };
    fetchDataApartamentos();
  }, []);

  useEffect(() => {
    const fetchDataEspacios = async () => {
      try {
        const response = await axios.get(`/admin/getParqueadero`);
        setdataEsp(response.data);
      } catch (error) {
        console.error("Error al obtener los espacios de parqueo:", error);
      }
    };
    fetchDataEspacios();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(data.length / recordsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="w-100 h-100" style={{ marginLeft: "3%" }}>
      <div className="card m-0 h-100">
        <div className="card-body">
          <div id="example2_wrapper" className="dataTables_wrapper dt-bootstrap4">
            {apiS === "Propietarios" ? (
              <Propietario item={item} currentRecords={currentRecords} apiS={apiS} data={dataApart} data2={dataEsp} />
            ) : apiS === "Parqueadero" ? (
              <Parqueadero item={item} currentRecords={currentRecords} apiS={apiS} data={dataEsp} />
            ) : apiS === "Invitados" ? (
              <Invitados item={item} currentRecords={currentRecords} apiS={apiS} data={dataApart} data2={dataEsp} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabla;
