import axios from "axios";
import { useState, useEffect } from "react";

const Parqueadero = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState([]); // Registros filtrados
  const [currentRecords, setCurrentRecords] = useState([]); // Registros originales
  const [filterAvailable, setFilterAvailable] = useState(false); // Filtro por disponibilidad
  const [filterType, setFilterType] = useState(""); // Filtro por tipo de espacio

  useEffect(() => {
    // Función para obtener los registros de la tabla espacios_parqueadero
    const fetchParqueaderos = async () => {
      try {
        const response = await axios.get("http://localhost:8081/espacios_parqueadero");
        setCurrentRecords(response.data); // Guardar registros originales
        setFilteredRecords(response.data); // Mostrar todos los registros por defecto
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchParqueaderos();
  }, []);

  // Filtrar registros manualmente
  const fetchFilteredRecords = (term) => {
    let results = currentRecords;

    // Aplicar búsqueda por número de espacio
    if (term) {
      results = results.filter(record =>
        record.numEspacio.toString().includes(term)
      );
    }

    // Aplicar filtro por disponibilidad
    if (filterAvailable) {
      results = results.filter(record => record.estado === "Disponible");
    }

    // Aplicar filtro por tipo de espacio (Carro/Moto)
    if (filterType) {
      results = results.filter(record => record.tipoEspacio === filterType);
    }

    setFilteredRecords(results); // Actualizar los registros filtrados
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm); // Llamar a la función de filtrado
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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success ms-2 py-1" type="submit">
          Buscar
        </button>
      </form>

      {/* Botones de filtrado */}
      <div className="mb-3 mt-5">
        <button
          className={`btn me-2 ${filterAvailable ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => {
            setFilterAvailable(!filterAvailable);
            fetchFilteredRecords(searchTerm); // Actualizar los registros con el nuevo filtro
          }}
        >
          {filterAvailable ? "Ver Todos" : "Disponibles"}
        </button>
        <button
          type="button"
          className={`btn me-2 ${filterType === "Carro" ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => {
            setFilterType(filterType === "Carro" ? "" : "Carro");
            fetchFilteredRecords(searchTerm); // Actualizar los registros con el nuevo filtro
          }}
        >
          {filterType === "Carro" ? "Ver Todos" : "Carros"}
        </button>
        <button
          className={`btn ${filterType === "Moto" ? "btn btn-primary" : "btn btn-dark"}`}
          onClick={() => {
            setFilterType(filterType === "Moto" ? "" : "Moto");
            fetchFilteredRecords(searchTerm); // Actualizar los registros con el nuevo filtro
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
            <th className="sorting text-light bg-dark">Número de Espacio</th>
            <th className="sorting text-light bg-dark">Tipo de Espacio</th>
            <th className="sorting text-light bg-dark">Estado</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.numEspacio}</td>
              <td>{record.tipoEspacio}</td>
              <td>{record.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Parqueadero;
