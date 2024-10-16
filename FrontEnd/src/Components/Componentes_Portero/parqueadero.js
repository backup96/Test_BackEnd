import axios from "axios";
import { useState, useEffect } from "react";

const Parqueadero = ({ item, currentRecords, apiS }) => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState(currentRecords);
  const [filteredAtt, setFilteredAtt] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false); // Nueva variable para mantener el paginado

  useEffect(() => {
    if (!searchPerformed) {
      // Solo aplicar filtros si no se ha hecho una búsqueda
      const applyFilters = () => {
        let records = currentRecords;

        if (filterAvailable) {
          records = records.filter((record) => record.Estado === "Disponible");
        }

        if (filterType) {
          records = records.filter((record) => record.TipoEspacio === filterType);
        }

        setFilteredRecords(records);
      };

      applyFilters();
    }
  }, [filterAvailable, filterType, currentRecords, searchPerformed]);

  const fetchFilteredRecords = async (term, att) => {
    try {
      if (term) {
        const response = await axios.get(
          `http://localhost:4000/${apiS}?${att}=${term}`
        );
        if (response.status === 200) {
          setFilteredRecords(response.data);
          setSearchPerformed(true); // Indicar que se ha realizado una búsqueda
        }
      } else {
        setFilteredRecords(currentRecords);
        setSearchPerformed(false); // Si no hay término de búsqueda, reiniciar
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al filtrar los registros");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm, filteredAtt);
  };

  return (
    <>
      {/* Formulario de búsqueda */}
      <form className="d-flex mb-3" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar por Número de Espacio"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setFilteredAtt("NumeroEspacio"); // Buscar por número de espacio
          }}
        />
        <button className="btn btn-success ms-2 py-1" type="submit">
          Search
        </button>
      </form>

      {/* Botones de filtrado */}
      <div className="mb-3 mt-5">
        <button
          className={`btn me-2 ${
            filterAvailable ? "btn btn-primary" : " btn btn-dark"
          }`}
          onClick={() => {
            setFilterAvailable(!filterAvailable);
            setSearchPerformed(false); // Resetea la búsqueda al aplicar filtro
          }}
        >
          {filterAvailable ? "Ver Todos" : "Disponibles"}
        </button>
        <button
          type="button"
          className={`btn me-2 ${
            filterType === "Carro" ? "btn btn-primary" : " btn btn-dark"
          }`}
          onClick={() => {
            setFilterType(filterType === "Carro" ? "" : "Carro");
            setSearchPerformed(false); // Resetea la búsqueda al aplicar filtro
          }}
        >
          {filterType === "Carro" ? "Ver Todos" : "Carros"}
        </button>
        <button
          className={`btn ${
            filterType === "Moto" ? "btn btn-primary" : " btn btn-dark"
          }`}
          onClick={() => {
            setFilterType(filterType === "Moto" ? "" : "Moto");
            setSearchPerformed(false); // Resetea la búsqueda al aplicar filtro
          }}
        >
          {filterType === "Moto" ? "Ver Todos" : "Motos"}
        </button>
      </div>

      {/* Tabla de resultados */}
      <table
        id="example2"
        className="table table-bordered table-hover table-sm"
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
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.NumeroEspacio}</td>
              <td>{record.TipoEspacio}</td>
              <td>{record.Estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación u otras funcionalidades de la parte inferior de la tabla */}
      {/* Aquí podrías implementar la paginación si ya está soportada */}
    </>
  );
};

export default Parqueadero;
