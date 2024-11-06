import axios from "axios";
import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquarePlus, faAnglesLeft, faAnglesRight, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"; // Importar el icono de lupa
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/* Añadir iconos a la librería */
library.add(faSquarePlus, faAnglesLeft, faAnglesRight, faMagnifyingGlass); // Añadir el icono de lupa

const Propietario = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 7; // Número de registros por página

  useEffect(() => {
    // Función para obtener los registros de la vista propietarios portero
    const fetchPropietarios = async () => {
      try {
        const response = await axios.get("http://localhost:8081/consultapropietarios");
        setCurrentRecords(response.data);
        setFilteredRecords(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchPropietarios();
  }, []);

  const fetchFilteredRecords = (term) => {
    if (term) {
      const results = currentRecords.filter(record => {
        const nombreCompleto = (record.nombre || '') + ' ' + (record.apellido || ''); // Concatenar nombre y apellido
        const telefono = record.telefono ? String(record.telefono) : ''; // Convertir a cadena si no es undefined
        const apartamento = record.apartamento ? String(record.apartamento) : ''; // Convertir a cadena si no es undefined
        
        return (
          nombreCompleto.toLowerCase().includes(term.toLowerCase()) || // Filtrar por nombre y apellido
          telefono.includes(term) || // Filtrar por teléfono
          apartamento.includes(term) // Filtrar por código de vivienda
        );
      });
      
      setFilteredRecords(results);
    } else {
      setFilteredRecords(currentRecords);
    }
    setCurrentPage(1); // Resetear a la primera página al filtrar
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm(""); // Resetear el término de búsqueda
    setFilteredRecords(currentRecords); // Volver a mostrar todos los registros
    setCurrentPage(1); // Resetear a la primera página
  };

  // Cálculo de paginación
  const indexOfLastRecord = currentPage * recordsPerPage; // Último registro actual
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage; // Primer registro actual
  const currentRecordsPaginated = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord); // Registros de la página actual
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage); // Total de páginas

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <form
        className="d-flex mb-3 align-items-end"
        role="search"
        onSubmit={handleSearch}
      >
        <div className="w-100 me-5">
        <label
                    className="text-start w-100 fw-normal"
                  >
                  Buscar por Nombre, Apellido, Teléfono o Código de Vivienda
                  </label>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Ejemplo -> Natalia Ramirez, 3118482726, 11101"
          aria-label="Search"
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
        <button
          className="btn btn-success py-1"
          type="submit"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} /> {/* Icono de lupa */}
        </button>
        <button
          className="btn btn-danger py-1 ms-2" // Añadir un margen a la izquierda para separar
          type="button" // Cambiar a type="button" para evitar que envíe el formulario
          onClick={handleReset} // Llamar a la función de resetear
        >
          <FontAwesomeIcon icon="fa-solid fa-xmark" /> {/* Icono de X */}
        </button>
      </form>
      
      <table
        id="example2"
        className="table table-bordered table-hover table-sm"
        aria-describedby="example2_info"
      >
        <thead>
          <tr>
            <th className="sorting text-light bg-dark">Nombre</th>
            <th className="sorting text-light bg-dark">Teléfono</th>
            <th className="sorting text-light bg-dark">Código Vivienda</th>
          </tr>
        </thead>
        <tbody>
          {currentRecordsPaginated.map((record, index) => (
            <tr key={index}>
              <td>{record.nombre} {record.apellido}</td> {/* Concatenar nombre y apellido */}
              <td>{record.telefono}</td>
              <td>{record.apartamento}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
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

export default Propietario;
