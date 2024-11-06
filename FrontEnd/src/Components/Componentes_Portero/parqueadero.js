import axios from "axios";
import { useState, useEffect } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquarePlus, faAnglesLeft, faAnglesRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

library.add(faSquarePlus, faAnglesLeft, faAnglesRight, faMagnifyingGlass);

const Parqueadero = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterType, setFilterType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7;

  useEffect(() => {
    const fetchParqueaderos = async () => {
      try {
        const response = await axios.get("http://localhost:8081/espacios_parqueadero");
        setCurrentRecords(response.data);
        setFilteredRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchParqueaderos();
  }, []);

  useEffect(() => {
    fetchFilteredRecords(); // Llama a la función de filtrado cada vez que cambien los filtros
  }, [searchTerm, filterAvailable, filterType, currentRecords]);

  const fetchFilteredRecords = () => {
    let results = currentRecords;

    // Aplicar búsqueda por número de espacio
    if (searchTerm) {
      results = results.filter((record) =>
        record.numEspacio.toString().includes(searchTerm)
      );
    }

    // Aplicar filtro por disponibilidad
    if (filterAvailable) {
      results = results.filter((record) => record.estado === "Disponible");
    }

    // Aplicar filtro por tipo de espacio (Carro/Moto)
    if (filterType) {
      results = results.filter((record) => record.tipoEspacio === filterType);
    }

    setFilteredRecords(results);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(); // Llama a la función de filtrado en la búsqueda
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilterAvailable(false);
    setFilterType("");
    setCurrentPage(1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentFilteredRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
      <form className="d-flex mb-3 align-items-end" role="search" onSubmit={handleSearch}>
        <div className="w-100 me-5">
        <label
                    className="text-start w-100 fw-normal"
                  >
                   Buscar por Número de Espacio
                  </label>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Ejemplo -> 10"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <button className="btn btn-success ms-2 py-1" type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        <button
          className="btn btn-danger py-1 ms-2"
          type="button"
          onClick={handleReset}
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" />
        </button>
      </form>

      <div className="mb-3 mt-5">
        <button
          className={`btn me-2 ${filterAvailable ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => setFilterAvailable(prev => !prev)} // Cambia solo el estado
        >
          Disponibles
        </button>
        <button
          type="button"
          className={`btn me-2 ${filterType === "Carro" ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => setFilterType(prev => (prev === "Carro" ? "" : "Carro"))} // Cambia solo el estado
        >
          Carros
        </button>
        <button
          className={`btn ${filterType === "Moto" ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => setFilterType(prev => (prev === "Moto" ? "" : "Moto"))} // Cambia solo el estado
        >
          Motos
        </button>
      </div>

      <table className="table table-bordered table-hover table-sm">
        <thead>
          <tr>
            <th className="sorting text-light bg-dark">Número de Espacio</th>
            <th className="sorting text-light bg-dark">Estado</th>
            <th className="sorting text-light bg-dark">Tipo de Espacio</th>
          </tr>
        </thead>
        <tbody>
          {currentFilteredRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.numEspacio}</td>
              <td>{record.estado}</td>
              <td>{record.tipoEspacio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row">
        <div className="col-sm-12 col-md-5">
          <div className="dataTables_info" role="status" aria-live="polite">
            Mostrando {indexOfFirstRecord + 1} a{" "}
            {indexOfLastRecord > filteredRecords.length ? filteredRecords.length : indexOfLastRecord}{" "}
            de {filteredRecords.length} registros
          </div>
        </div>
        <div className="col-sm-12 col-md-7">
          <div className="dataTables_paginate paging_simple_numbers">
            <ul className="pagination">
              <li className={`paginate_button page-item previous ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="page-link"
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index}
                  className={`paginate_button page-item ${currentPage === index + 1 ? "active" : ""}`}
                >
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className="page-link"
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`paginate_button page-item next ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="page-link"
                >
                  <FontAwesomeIcon icon={faAnglesRight} />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Parqueadero;
