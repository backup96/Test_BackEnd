import { Link, useNavigate } from "react-router-dom";
import myImg from "../../img/logo2.png";
import Tabla from "./tabla";
import { useEffect, useState } from "react";
import Profile from "./profile";
import '../estilosnav.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { faPersonMilitaryPointing } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

library.add(faHouse);
library.add(faUser);
library.add(faCar);
library.add(faChampagneGlasses);
library.add(faHandshake);
library.add(faPersonMilitaryPointing);
library.add(faXmark);

export function NavBar() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

 const getCookie = async () => {
   const cookie = await axios.get("http://localhost:8081/public", {
     withCredentials: true,
   });
   if (cookie.data.Status === "Success") {
     setName(cookie.data.nombreUsuario);
   } else {
     navigate("/");
   }
   console.log(cookie, "Hola");
 };

 useEffect(() => {
   getCookie();
 }, []);

  const [currentTable, setCurrentTable] = useState("Parqueadero");
  const [showSideBar, setShowSideBar] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    axios
      .get("/public/logout")
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column justify-content-start h-100 ">
      <nav className="navbar navbar-expand-lg navbar-custom w-100">
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
            <img src={myImg} style={{ width: 70, height: 70 }} alt="Icon"></img>
          </div>

          <div className="btn-group">
            <button
              type="button"
              className="btn btn-outline-light dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Acción
            </button>
            <ul className="dropdown-menu">
              <li>
                <Link
                  className="dropdown-item text-primary"
                  aria-current="page"
                  to="#"
                  onClick={() => {
                    setCurrentTable("perfil");
                  }}
                >
                  Ver perfil
                </Link>
              </li>
              <Link
                onClick={handleDelete}
                className="dropdown-item text-danger"
                to="/"
              >
                Cerrar Sesión
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      {/* SideBar y contenido */}
      <div className="d-flex flex-row h-100">
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
          <div className="d-flex flex-column p-3 sidebar-custom h-100">
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
                    setCurrentTable("Parqueadero");
                  }}
                  id="myLink"
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
                    setCurrentTable("SalonComunal");
                  }}
                  href="#"
                  className={
                    currentTable === "SalonComunal"
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
            </ul>
            <hr />
          </div>
        </div>
        <div className="w-100 h-100" style={{ marginLeft: "3%" }}>
          {currentTable === "perfil" ? (
            <Profile name={name} />
          ) : (
            <Tabla apiS={currentTable} name={name} />
          )}
        </div>
      </div>
    </div>
  );
}
