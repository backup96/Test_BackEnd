/* Importación de paquetes necesarios */
import React, {
} from "react"; /* Paquete necesario para manipular el estado del componente de clase MainAdmin */
/* Importación de iconos */
import { NavBar } from "../../../Components/Componentes_Portero/navBar";

/* Componente de clase MainAdmin */
export function MainPortero() {
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/LoginPortero");
  //   }
  // });
  return (
    <>
      <NavBar />
    </>
  );
}
// }

export default MainPortero; /* Sentencia para la exportación del modulo Main al archivo de rutas App.js */
