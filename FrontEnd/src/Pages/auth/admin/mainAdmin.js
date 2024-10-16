/* Importación de paquetes necesarios */
import React, { useEffect } from "react"; /* Paquete necesario para manipular el estado del componente de clase MainAdmin */
import { useNavigate } from "react-router-dom";
/* Importación de iconos */
import { NavBar } from "../../../Components/Componentes_Admin/navBar";
import { useUser } from "../../../userContext";

/* Componente de clase MainAdmin */
export function MainAdmin() {
  const { user } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/LoginAdministrador");
    }
  });
    return (
    <>
      <NavBar /> 
    </>
  );
}
// }

export default MainAdmin; /* Sentencia para la exportación del modulo Main al archivo de rutas App.js */
