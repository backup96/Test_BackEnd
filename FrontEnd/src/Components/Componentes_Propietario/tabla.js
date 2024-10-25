import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../userContext";
import Calendario from "./calendario"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Tabla = ({ apiS, name }) => {
  const [currentPageMoto, setCurrentPageMoto] = useState(1);
  const [currentPageCarro, setCurrentPageCarro] = useState(1);
  const { user, setUser } = useUser();
  const [searchTermMoto, setSearchTermMoto] = useState("");
  const [searchTermCarro, setSearchTermCarro] = useState("");

  const recordsPerPage = 12;

  const [dataMoto, setDataMoto] = useState([]);
  const [dataCarro, setDataCarro] = useState([]);

  useEffect(() => {
    const fetchEspacios = () => {
      Promise.all([
        axios.get(`http://localhost:8081/espacio_parqueadero?tipoEspacio=Moto`),
        axios.get(`http://localhost:8081/espacio_parqueadero?tipoEspacio=Carro`)
      ])
      .then(([responseMoto, responseCarro]) => {
        setDataMoto(responseMoto.data.data || []);
        setDataCarro(responseCarro.data.data || []);
      })
      .catch((error) => {
        console.error("Error al obtener los datos:", error);
        toast.error("Error al obtener los datos.");
      });
    };
  
    fetchEspacios();
  }, [apiS]);

  const indexOfLastRecordMoto = currentPageMoto * recordsPerPage;
  const indexOfFirstRecordMoto = indexOfLastRecordMoto - recordsPerPage;

  const indexOfLastRecordCarro = currentPageCarro * recordsPerPage;
  const indexOfFirstRecordCarro = indexOfLastRecordCarro - recordsPerPage;

  const currentRecordsMoto = dataMoto
    .filter((record) => record.estado === 'Disponible')
    .slice(indexOfFirstRecordMoto, indexOfLastRecordMoto);

  const totalPagesMoto = Math.ceil(
    dataMoto.filter((record) => record.estado === 'Disponible').length /
      recordsPerPage
  );

  const currentRecordsCarro = dataCarro
    .filter((record) => record.estado === 'Disponible')
    .slice(indexOfFirstRecordCarro, indexOfLastRecordCarro);

  const totalPagesCarro = Math.ceil(
    dataCarro.filter((record) => record.estado === 'Disponible').length /
      recordsPerPage
  );

  const handlePageChangeMoto = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPagesMoto) return;
    setCurrentPageMoto(pageNumber);
  };

  const handlePageChangeCarro = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPagesCarro) return;
    setCurrentPageCarro(pageNumber);
  };

  const rentSpace = (spaceId, EspacioParqueadero, espacioNumero) => {
    const nombreUsuario = user?.name; // Obtener el nombre del usuario
  
    if (!nombreUsuario) { // Verifica si el usuario existe y tiene un nombre
      toast.error("Error: Usuario no encontrado.");
      return;
    }
  
    const espacioMoto = user.espacioMoto || null;
    const espacioCarro = user.espacioCarro || null;
  
    if (
      (EspacioParqueadero === "Moto" && espacioMoto) ||
      (EspacioParqueadero === "Carro" && espacioCarro)
    ) {
      toast.error("Error: Solo puedes rentar un espacio de moto y un espacio de carro.");
      return;
    }
  
    axios.put(`http://localhost:8081/espacio_parqueadero/${spaceId}/estado`, {
      idEstado: 2 // Asumiendo que 2 es el ID del estado "Ocupado"
    })
    .then(() => {
      // Actualiza el estado del espacio en la UI
      if (EspacioParqueadero === "Moto") {
        setDataMoto((prevData) =>
          prevData.map((item) =>
            item.numEspacio === espacioNumero ? { ...item, estado: "Ocupado" } : item
          )
        );
      } else {
        setDataCarro((prevData) =>
          prevData.map((item) =>
            item.numEspacio === espacioNumero ? { ...item, estado: "Ocupado" } : item
          )
        );
      }
  
      const updatedUser = {
        ...user,
        espacioMoto: EspacioParqueadero === "Moto" ? espacioNumero : espacioMoto,
        espacioCarro: EspacioParqueadero === "Carro" ? espacioNumero : espacioCarro,
      };
  
      // Llamada al endpoint para registrar el alquiler
      return axios.post('http://localhost:8081/rentar_espacio', {
        nombreUsuario: user.nombre, // Asegúrate de que el nombre del usuario está disponible
        idParqueaderoFk: spaceId
      })
      .then(() => {
        return axios.patch(`http://localhost:8081/usuarios/${user.id}`, updatedUser);
      });
    })
    .then((response) => {
      setUser(response.data);
      toast.success("Usted rentó un espacio de parqueadero exitosamente");
    })
    .catch((error) => {
      console.error("Error al rentar el espacio:", error);
      toast.error("Error al rentar el espacio");
    });
  };

  const handleSearchMoto = (e) => {
    e.preventDefault();
    console.log("Buscando Moto:", searchTermMoto); // Debugging
    fetchFilteredRecordsMoto(searchTermMoto);
  };

  const handleSearchCarro = (e) => {
    e.preventDefault();
    console.log("Buscando Carro:", searchTermCarro); // Debugging
    fetchFilteredRecordsCarro(searchTermCarro);
  };

  const fetchFilteredRecordsMoto = async (term) => {
    try {
      if (term) {
        const response = await axios.get(
          `http://localhost:8081/espacio_parqueadero?numEspacio=${term}&tipoEspacio=Moto`
        );
        console.log("Datos Moto Filtrados:", response.data.data);
        if (response.data.status === 'success' && response.data.data.length > 0) {
          const filteredData = response.data.data.filter(record => record.numEspacio === parseInt(term));
          setDataMoto(filteredData);
          setCurrentPageMoto(1);
        } else {
          toast.warning("No se encontraron espacios de moto con ese número.");
          setDataMoto([]); // Limpia los datos si no hay resultados
        }
      } else {
        const responseMoto = await axios.get(`http://localhost:8081/espacio_parqueadero?tipoEspacio=Moto`);
        setDataMoto(responseMoto.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error al filtrar los registros");
    }
  };

  const fetchFilteredRecordsCarro = (term) => {
    if (term) {
      axios
        .get(`http://localhost:8081/espacio_parqueadero?numEspacio=${term}&tipoEspacio=Carro`)
        .then((response) => {
          console.log("Datos Carro Filtrados:", response.data.data);
          if (response.data.status === 'success' && response.data.data.length > 0) {
            const filteredData = response.data.data.filter(record => record.numEspacio === parseInt(term));
            setDataCarro(filteredData);
            setCurrentPageCarro(1);
          } else {
            toast.warning("No se encontraron espacios de carro con ese número.");
            setDataCarro([]); // Limpia los datos si no hay resultados
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Este espacio no se encuentra disponible.");
        });
    } else {
      axios
        .get(`http://localhost:8081/espacio_parqueadero?tipoEspacio=Carro`)
        .then((responseCarro) => {
          setDataCarro(responseCarro.data.data);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error al obtener los espacios de carro.");
        });
    }
  };
  
  const hasRentedMoto = user && user.espacioMoto;
  const hasRentedCarro = user && user.espacioCarro;

  return (
    <div className="w-100 h-100">
      <ToastContainer />

      <div className="card m-0 h-100">
        {apiS === "Parqueadero" ? (
          <div className="d-flex flex-row">
            {/* Moto Section */}
            <div className="px-3 w-50">
              <form 
                className="d-flex flex-column mb-3 align-items-start" 
                role="search" 
                onSubmit={handleSearchMoto}
              >
                <label className="text-start w-100 fw-normal mb-2" htmlFor="searchParam">
                  Buscar por espacio de parqueadero de Moto
                </label>

                <div className="d-flex w-100">
                  <input
                    id="searchParam"
                    className="form-control me-2"
                    type="search"
                    placeholder="Ejemplo -> 29"
                    aria-label="Search"
                    required
                    value={searchTermMoto}
                    onChange={(e) => setSearchTermMoto(e.target.value)}
                  />
                  <button className="btn bg-success py-1" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </form>
              <h2 className="text-center">Moto</h2>
              {hasRentedMoto ? (
                <p className="text-center text-danger">
                  Ya has rentado un espacio de moto. 
                </p>
              ) : (
                <>
                  <div className="d-flex flex-wrap mt-3">
                    {currentRecordsMoto.map((record) => (
                      <div
                        key={record.numEspacio}
                        className="d-flex flex-column border border-primary rounded-4 w-25 p-2"
                      >
                        <span className="fs-3 fw-bolder">{record.numEspacio}</span>
                        <button
                          type="button"
                          className="btn bg-success btn-sm p-1"
                          onClick={() => rentSpace(record.numEspacio, "Moto", record.numEspacio)}
                          disabled={hasRentedMoto}
                        >
                          Rentar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination and Record Info for Moto */}
                  <div className="card-body">
                    <div className="dataTables_wrapper dt-bootstrap4">
                      <div className="row">
                        <div className="col-sm-12 col-md-5">
                          <div
                            className="dataTables_info"
                            role="status"
                            aria-live="polite"
                          >
                            Mostrando {indexOfFirstRecordMoto + 1} a{" "}
                            {indexOfLastRecordMoto > dataMoto.length
                              ? dataMoto.length
                              : indexOfLastRecordMoto}{" "}
                            de {dataMoto.length} registros
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                          <div className="dataTables_paginate paging_simple_numbers">
                            <ul className="pagination">
                              <li
                                className={`paginate_button page-item previous ${
                                  currentPageMoto === 1 ? "disabled" : ""
                                }`}
                              >
                                <Link
                                  onClick={() =>
                                    handlePageChangeMoto(currentPageMoto - 1)
                                  }
                                  to="#"
                                  className="page-link"
                                >
                                  Anterior
                                </Link>
                              </li>
                              {[...Array(totalPagesMoto)].map((_, index) => (
                                <li
                                  key={index}
                                  className={`paginate_button page-item ${
                                    currentPageMoto === index + 1 ? "active" : ""
                                  }`}
                                >
                                  <button
                                    onClick={() =>
                                      handlePageChangeMoto(index + 1)
                                    }
                                    className="page-link"
                                  >
                                    {index + 1}
                                  </button>
                                </li>
                              ))}
                              <li
                                className={`paginate_button page-item next ${
                                  currentPageMoto === totalPagesMoto
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <Link
                                  onClick={() =>
                                    handlePageChangeMoto(currentPageMoto + 1)
                                  }
                                  to="#"
                                  className="page-link"
                                >
                                  Siguiente
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Carro Section */}
            <div className="px-3 w-50">
              <form 
                className="d-flex flex-column mb-3 align-items-start" 
                role="search"
                onSubmit={handleSearchCarro}
              >
                <label className="text-start w-100 fw-normal mb-2" htmlFor="searchParam">
                  Buscar por espacio de parqueadero de Carro
                </label>
                <div className="d-flex w-100">
                  <input
                    id="searchParam"
                    className="form-control me-2"
                    type="search"
                    placeholder="Ejemplo -> 12"
                    aria-label="Seacrh"
                    required
                    value={searchTermCarro}
                    onChange={(e) => setSearchTermCarro(e.target.value)}
                  />
                  <button className="btn bg-success py-1" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </form>
              <h2 className="text-center">Carro</h2>
              {hasRentedCarro ? (
                <p className="text-center text-danger">
                  Ya has rentado un espacio de carro.
                </p>
              ) : (
                <>
                  <div className="d-flex flex-wrap mt-3">
                    {currentRecordsCarro.map((record) => (
                      <div
                        key={record.numEspacio}
                        className="d-flex flex-column border border-primary rounded-4 w-25 p-2"
                      >
                        <span className="fs-3 fw-bolder">{record.numEspacio}</span>
                        <button
                          type="button"
                          className="btn bg-success btn-sm p-1"
                          onClick={() => rentSpace(record.numEspacio, "Carro", record.numEspacio)}
                          disabled={hasRentedCarro}
                        >
                          Rentar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Pagination and Record Info for Carro */}
                  <div className="card-body">
                    <div className="dataTables_wrapper dt-bootstrap4">
                      <div className="row">
                        <div className="col-sm-12 col-md-5">
                          <div
                            className="dataTables_info"
                            role="status"
                            aria-live="polite"
                          >
                            Mostrando {indexOfFirstRecordCarro + 1} a{" "}
                            {indexOfLastRecordCarro > dataCarro.length
                              ? dataCarro.length
                              : indexOfLastRecordCarro}{" "}
                            de {dataCarro.length} registros
                          </div>
                        </div>
                        <div className="col-sm-12 col-md-7">
                          <div className="dataTables_paginate paging_simple_numbers">
                            <ul className="pagination">
                              <li
                                className={`paginate_button page-item previous ${
                                  currentPageCarro === 1 ? "disabled" : ""
                                }`}
                              >
                                <Link
                                  onClick={() =>
                                    handlePageChangeCarro(currentPageCarro - 1)
                                  }
                                  to="#"
                                  className="page-link"
                                >
                                  Anterior
                                </Link>
                              </li>
                              {[...Array(totalPagesCarro)].map((_, index) => (
                                <li
                                  key={index}
                                  className={`paginate_button page-item ${
                                    currentPageCarro === index + 1 ? "active" : ""
                                  }`}
                                >
                                  <button
                                    onClick={() => handlePageChangeCarro(index + 1)}
                                    className="page-link"
                                  >
                                    {index + 1}
                                  </button>
                                </li>
                              ))}
                              <li
                                className={`paginate_button page-item next ${
                                  currentPageCarro === totalPagesCarro ? "disabled" : ""
                                }`}
                              >
                                <Link
                                  onClick={() =>
                                    handlePageChangeCarro(currentPageCarro + 1)
                                  }
                                  to="#"
                                  className="page-link"
                                >
                                  Siguiente
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <Calendario name={name}/>
        )}
      </div>
    </div>
  );
};

export default Tabla;