import { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./Pages/auth/main";
import MainAdmin from "./Pages/auth/admin/mainAdmin";
import LoginAdministrador from "./Pages/auth/Login/LoginAdministrador";
import LoginPortero from "./Pages/auth/Login/LoginPortero";
import LoginPropietario from "./Pages/auth/Login/LoginPropietario";
import MainPropietario from "./Pages/auth/propietario/mainPropietario";
import MainPortero from "./Pages/auth/portero/mainPortero.";
import RegisterPropietario from "./Pages/auth/Login/RegisterPropietario";
import Tabla from "./Components/Componentes_Propietario/tabla"; // Asegúrate de la ruta correcta
import Profile from "./Components/Componentes_Propietario/profile";
import InvitadoDetalle from './Pages/auth/portero/InvitadoDetalles.js';

function App() {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" exact element={<Main />}></Route>
          <Route path="MainAdmin" exact element={<MainAdmin />}>
            <Route path="Tabla" element={<Tabla apiS="Parqueadero" />} />
          </Route>
          <Route path="MainPortero" exact element={<MainPortero />}></Route>
          <Route path="LoginAdministrador" exact element={<LoginAdministrador />}></Route>
          <Route path="LoginPortero" exact element={<LoginPortero />}></Route>
          <Route path="RegisterPropietario" exact element={<RegisterPropietario />}></Route>
          <Route path="LoginPropietario" exact element={<LoginPropietario />}></Route>
          <Route path="MainPropietario" exact element={<MainPropietario />}></Route>
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/invitado/:id" exact element={<InvitadoDetalle />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
