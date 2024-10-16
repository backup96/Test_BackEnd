import { Link } from "react-router-dom";
import myImg from "../../img/logo2.png"; /* Logo del conjutno */
import { useUser } from "../../userContext";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { createContext, useContext ,useState } from "react";
import Tabla from "./tabla";
import InvitadoDetalle from "../../Pages/auth/portero/InvitadoDetalles";

const TableContext = createContext();

library.add(faHouse);
library.add(faUser);
library.add(faCar);
library.add(faChampagneGlasses);
library.add(faHandshake);
library.add(faPersonMilitaryPointing);
library.add(faXmark);

export const NavBar = ({ children }) => {
  const { setUser: setContextUser } = useUser();
  const [invitado, setInvitado] = useState(null);
  const [currentTable, setCurrentTable] = useState("Propietarios");
  const [showSideBar, setShowSideBar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TableContext.Provider value={{currentTable, setCurrentTable, invitado, setInvitado}}>
      <div className="d-flex flex-column justify-content-start h-100 ">
      {/* Barra de navegación */}
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark py-2 bg-dark">
          <div className="container px-lg-5 d-flex flex-row justify-content-between">
            <div>
              <button
                class="btn"
                type="button"
                onClick={() => {
                  showSideBar === true
                    ? setShowSideBar(false)
                    : setShowSideBar(true);
                }}
              >
                . . .
              </button>
            </div>

            <div>
              <img
                src={myImg}
                style={{ width: 70, height: 70 }}
                alt="Icon"
              ></img>
            </div>

            <div className="btn-group">
              <div className="collapse navbar-collapse" id="navContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      onClick={() => setContextUser(null)}
                      className="btn btn-outline-light"
                      to="/"
                    >
                      Cerrar Sesión
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div className="h-100">
        <div className="d-flex flex-row h-100">
          {/* SideBar */}
          <div
            class="offcanvas offcanvas-start show"
            data-bs-scroll="true"
            data-bs-backdrop="false"
            tabindex="-1"
            id="offcanvasScrolling"
            aria-labelledby="offcanvasScrollingLabel"
            onMouseEnter={() => {
              setIsHovered(true);
              setShowSideBar(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
              setShowSideBar(false);
            }}
            style={{
              transform:
                showSideBar === false
                  ? "translateX(-83%)"
                  : isHovered
                  ? "translateX(0%)"
                  : "translateX(0%)",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <div className="d-flex flex-column p-3 text-white bg-dark h-100">
              <div
                style={{
                  transform:
                    showSideBar === true ? "translateX(92%)" : "translateX(0%)",
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                <Link className="text-white">
                  <FontAwesomeIcon
                    onClick={() => setShowSideBar(false)}
                    icon={faXmark}
                  />
                </Link>
              </div>
              <hr />
              <ul className="nav nav-pills flex-column mb-auto">
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Propietarios");
                    }}
                    href="#"
                    className={
                      currentTable === "Propietarios"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Propietarios</div>
                    <div>
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Parqueadero");
                    }}
                    href="#"
                    className={
                      currentTable === "Parqueadero"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Parqueadero</div>
                    <div>
                      <FontAwesomeIcon icon={faCar} />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Invitados");
                    }}
                    href="#"
                    className={
                      currentTable === "Invitados"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Invitados</div>
                    <div>
                      <FontAwesomeIcon icon={faHouse} />
                    </div>
                  </Link>
                </li>
              </ul>
              <hr />
            </div>
          </div>
          {/* Tabla de contenido */}
          {currentTable === "Clock" ? (
            <InvitadoDetalle />
          ) : (
            <Tabla
              item={
                currentTable === "Propietarios"
                  ? [
                      "Código de vivienda",
                      "Nombre",
                      "Teléfono",
                      "Correo",
                      "Número de Documento",
                      "Meses Atrasados",
                    ]
                  : currentTable === "Parqueadero"
                  ? ["Número de Espacio", "Tipo de Espacio", "Estado"]
                  : currentTable === "Invitados"
                  ? [
                      "Nombre",
                      "Número de Documento",
                      "Teléfono",
                      "Correo",
                      "Número de parqueadero",
                      "Costo",
                      "Código de Vivienda",
                      "Acciones",
                    ]
                  : ["Nombre", "Numero de Documento", "Teléfono", "Correo"]
              }
              apiS={currentTable}
            />
          )}
        </div>
      </div>
    </div>
    </TableContext.Provider>
    
  );
};

export const useTable = () => {
  return useContext(TableContext);
}


