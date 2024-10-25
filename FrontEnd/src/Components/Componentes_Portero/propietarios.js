import axios from "axios";
import { useEffect, useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

/* Añadir iconos a la librería */
library.add(faSquarePlus);

const Propietario = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [currentRecords, setCurrentRecords] = useState([]);

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
      // Filtrar registros manualmente
      const results = currentRecords.filter(record =>
        (record.nombre + ' ' + record.apellido).toLowerCase().includes(term.toLowerCase()) ||
        record.telefono.includes(term) ||
        record.apartamento.includes(term)
      );
      setFilteredRecords(results);
    } else {
      setFilteredRecords(currentRecords);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFilteredRecords(searchTerm);
  };

  return (
    <>
      <form className="d-flex mb-3" role="search" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Buscar por Nombre"
          aria-label="Search"
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-success py-1"
          type="submit"
        >
          Search
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
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td>{record.nombre} {record.apellido}</td> {/* Concatenar nombre y apellido */}
              <td>{record.telefono}</td>
              <td>{record.apartamento}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Propietario;
