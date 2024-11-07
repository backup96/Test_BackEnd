/* Importación de paquetes necesarios */
import React from "react"; /* Paquete necesario para manipular el estado del componente de clase MainAdmin */
import { NavBar } from "../../../Components/Componentes_Admin/navBar";

/* Componente de clase MainAdmin */
export function MainAdmin() {
    return (
    <>
      <NavBar /> 
    </>
  );
}

export default MainAdmin; /* Sentencia para la exportación del modulo Main al archivo de rutas App.js */
