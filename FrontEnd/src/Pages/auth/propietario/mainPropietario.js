import React, { useEffect } from "react";
/* Importación de iconos */
import { NavBar } from "../../../Components/Componentes_Propietario/navBar";
import { useUser } from "../../../userContext";
import { useNavigate } from "react-router-dom";

const MainPropietario = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  console.log(user)
  useEffect(() => {
    if (!user) {
      navigate("/LoginPropietario");
    }
  });
  return (
    <>
      <NavBar />
    </>
  );
};

export default MainPropietario;
