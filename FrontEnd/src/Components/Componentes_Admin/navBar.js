import { Link } from "react-router-dom";
import myImg from "../../img/logo2.png"; /* Logo del conjutno */
import { useUser } from "../../userContext";
import { useState } from "react";
import Tabla from "./tabla";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

library.add(faHouse);
library.add(faUser);
library.add(faCar);
library.add(faChampagneGlasses);
library.add(faHandshake);
library.add(faPersonMilitaryPointing);
library.add(faXmark);

export function NavBar() {
  const { setUser: setContextUser } = useUser();
  const [currentTable, setCurrentTable] = useState("Apartamentos");
  const [showSideBar, setShowSideBar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentDropMenu, setCurrentDropMenu] = useState("Acción");

  return (
    <div className="d-flex flex-column justify-content-start h-100 ">
      {/* NavBar */}
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
              <button
                type="button"
                className="btn btn-outline-light dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentDropMenu}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link
                    className="dropdown-item text-primary"
                    aria-current="page"
                    to="#"
                    onClick={() => {
                      setCurrentTable("Solicitudes");
                      setCurrentDropMenu("Solicitudes");
                    }}
                  >
                    Solicitudes
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-primary"
                    to="#"
                    onClick={() => {
                      setCurrentTable("Informacion");
                      setCurrentDropMenu("Informacion");
                    }}
                  >
                    Enviar información
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item text-primary"
                    to="#"
                    onClick={() => {
                      setCurrentTable("Reporte");
                      setCurrentDropMenu("Reporte");
                    }}
                  >
                    Generar reporte
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => setContextUser(null)}
                    className="dropdown-item text-danger"
                    to="/"
                  >
                    Cerrar Sesión
                  </Link>
                </li>
              </ul>
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
                <li className="nav-item">
                  <Link
                    onClick={() => {
                      setCurrentTable("Apartamentos");
                      setCurrentDropMenu("Acción");
                    }}
                    id="myLink"
                    href="#"
                    className={
                      currentTable === "Apartamentos"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Viviendas</div>
                    <div>
                      <FontAwesomeIcon icon={faHouse} />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Propietarios");
                      setCurrentDropMenu("Acción");
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
                      setCurrentDropMenu("Acción");
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
                      setCurrentDropMenu("Acción");
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
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("ReservaSalon");
                      setCurrentDropMenu("Acción");
                    }}
                    href="#"
                    className={
                      currentTable === "ReservaSalon"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Salon Comunal</div>
                    <div>
                      <FontAwesomeIcon icon={faChampagneGlasses} />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Reuniones");
                      setCurrentDropMenu("Acción");
                    }}
                    href="#"
                    className={
                      currentTable === "Reuniones"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Reuniones</div>
                    <div>
                      <FontAwesomeIcon icon={faHandshake} />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={() => {
                      setCurrentTable("Porteros");
                      setCurrentDropMenu("Acción");
                    }}
                    href="#"
                    className={
                      currentTable === "Porteros"
                        ? "nav-link active d-flex flex-row justify-content-between"
                        : "nav-link text-white d-flex flex-row justify-content-between"
                    }
                    aria-current="page"
                  >
                    <div className="w-100">Porteros</div>
                    <div>
                      <FontAwesomeIcon icon={faPersonMilitaryPointing} />
                    </div>
                  </Link>
                </li>
              </ul>
              <hr />
            </div>
          </div>
          {/* Tabla de contenido */}
          <Tabla
            item={
              currentTable === "Apartamentos"
                ? ["Código de vivienda", "Número de parqueadero"]
                : currentTable === "Propietarios"
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
                  ]
                : currentTable === "ReservaSalon"
                ? []
                : currentTable === "Reuniones"
                ? [
                    "Número de Reunión",
                    "Motivo",
                    "Fecha",
                    "Hora Inicio",
                    "Hora Finalización",
                  ]
                : currentTable === "Porteros"
                ? [
                    "Nombre",
                    "Número de Documento",
                    "Teléfono",
                    "Correo",
                    "Tipo de Turno",
                  ]
                : currentTable === "Solicitudes"
                ? []
                : currentTable === "Informacion"
                ? []
                : currentTable === "Reporte"
                ? ["Código de vivienda", "Nombre", "Saldo de deuda"]
                : null
            }
            apiS={currentTable}
          />
        </div>
      </div>
    </div>
  );
}
