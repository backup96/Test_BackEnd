import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const routerAdmin = (app, db) => {
  const router = express.Router();

  const salt = 10;

  // Ruta para confirmación de creación de cuenta
  router.post("/confirmAcc", (req, res) => {
    console.log(req);
    const sql = "Call Inserción_Persona(?)";
    bcrypt.hash(req.body.NumeroDocumento.toString(), salt, (err, hash) => {
      if (err)
        return res.json({ Error: "Fallo en la encriptación de la contraseña" });
      const values = [
        req.body.Nombre,
        req.body.Apellido,
        req.body.Teléfono,
        req.body.NumeroDocumento,
        req.body.Correo,
        req.body.CodigoVivienda,
        hash,
      ];
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error en la consulta:", err); // Muestra el error en el servidor
          return res
            .status(500)
            .json({ Error: "Error al enviar solicitud de registro" });
        }
        return res.json({ Status: "Success" });
      });
    });
  });

  // Ruta para inicio de sesión en administrador
  router.post("/login", (req, res) => {
    const sql = "SELECT * FROM login_admin WHERE nombreUsuario = ?";
    const values = [req.body.nombreUsuario];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      if (data.length > 0) {
        bcrypt.compare(
          req.body.clave.toString(),
          data[0].clave,
          (err, response) => {
            if (err)
              return res.json({ Error: "Error al comparar constraseñas" });
            if (response) {
              const nombreUsuario = data[0].nombreUsuario;
              const token = jwt.sign({ nombreUsuario }, "jwt-secret-key", {
                expiresIn: "1d",
              });
              res.cookie("token", token);
              return res.json({ Status: "Success" });
            } else {
              return res.json({ Error: "Las constraseñas no coinciden" });
            }
          }
        );
      } else {
        return res.json({
          Error: "Nombre de usuario o contraseña incorrectos",
        });
      }
    });
  });

  // Ruta para obtener el archivo PDF desde la base de datos
  router.get("/descargar/:id", (req, res) => {
    const id = req.params.id;

    // Consulta para obtener el archivo PDF por su id
    const sql = "SELECT Archivo FROM solicitud WHERE idSolicitud = ?";

    db.query(sql, [id], (err, result) => {
      if (err) throw err;

      if (result.length > 0) {
        const archivo = result[0].Archivo;

        // Enviar el archivo como respuesta
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="archivo_${id}.pdf"`
        );
        res.send(archivo);
      } else {
        res.status(404).send("Archivo no encontrado");
      }
    });
  });

  // Ruta para consulta de solicitudes para creación de cuenta
  router.get("/getSolicitudes", (req, res) => {
    const sql = "SELECT * FROM solicitud";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // -----------------------------------------------------------------//

  // Crud viviendas
  // Consultar viviendas
  router.get("/getApartamentos", (req, res) => {
    const sql = "SELECT * FROM apartamento";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Consultar viviendas específico
  router.post("/getApartamentosEsp", (req, res) => {
    const sql = "SELECT * FROM apartamento WHERE codigoVivienda = ?";
    db.query(sql, [req.body.Term], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al buscar apartamento" });
      }
      res.json(data);
    });
  });

  // Insertar viviendas
  router.post("/postApartamentos", (req, res) => {
    console.log(req.body);
    const sql = "Call Inserción_Apartamento(?)";
    const values = [req.body.Bloque, req.body.Torre, req.body.numAprt];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Actualizar viviendas
  router.post("/patchApartamentos", (req, res) => {
    console.log(req.body);
    const sql = "Call Actualización_Apartamento(?)";
    const values = [
      req.body.codApt,
      req.body.Bloque,
      req.body.Torre,
      req.body.numAprt,
    ];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al actualizar el apartamento" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Eliminar viviendas
  router.post("/deleteApartamentos", (req, res) => {
    console.log(req.body);
    const sql = "DELETE FROM apartamento WHERE codigoVivienda = ?";
    const values = [req.body.codApt];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Al eliminar el registro:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al eliminar el registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  //--------------------------------------------------------//

  // Crud propietarios
  // Consultar propietarios
  router.get("/getPropietarios", (req, res) => {
    const sql = "SELECT * FROM get_propietarios";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Consultar propietarios específico
  router.post("/getPropietarioEsp", (req, res) => {
    const sql = "SELECT * FROM get_propietarios WHERE numDocumento = ?";
    db.query(sql, [req.body.Term], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al buscar apartamento" });
      }
      res.json(data);
    });
  });

  // Insertar propietarios
  router.post("/postPropietarios", (req, res) => {
    console.log(req);
    const sql = "Call Inserción_Persona_Admin(?)";
    bcrypt.hash(req.body.NumeroDocumento.toString(), salt, (err, hash) => {
      if (err)
        return res.json({ Error: "Fallo en la encriptación de la contraseña" });
      const values = [
        req.body.Nombre,
        req.body.Apellido,
        req.body.Teléfono,
        req.body.NumeroDocumento,
        req.body.Correo,
        req.body.CodigoVivienda,
        req.body.EspacioParqueadero,
        req.body.Placa,
        hash,
      ];
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error en la consulta:", err); // Muestra el error en el servidor
          return res
            .status(500)
            .json({ Error: "Error al enviar solicitud de registro" });
        }
        return res.json({ Status: "Success" });
      });
    });
  });

  // Actualizar propietarios
  router.post("/patchPropietarios", (req, res) => {
    console.log(req.body);
    const sql = "Call Actualizacion_Propietarios(?)";
    const values = [
      req.body.NumeroDocumento,
      req.body.Teléfono,
      req.body.Correo,
      req.body.EspacioParqueadero,
      req.body.Placa,
      req.body.CodigoVivienda,
    ];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al actualizar el apartamento" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Eliminar propietarios
  router.post("/deletePropietarios", (req, res) => {
    console.log(req.body);
    const sql = "Call Eliminar_propietario(?)";
    const values = [req.body.NumeroDocumento];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Al eliminar el registro:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al eliminar el registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // -------------------------------------------------------//

  // Crud porteros
  // Consultar porteros
  router.get("/getPorteros", (req, res) => {
    const sql = "SELECT * FROM get_porteros";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Insertar porteros
  router.post("/postPorteros", (req, res) => {
    console.log(req);
    const sql = "Call Inserción_Portero(?)";
    bcrypt.hash(req.body.NumeroDocumento.toString(), salt, (err, hash) => {
      if (err)
        return res.json({ Error: "Fallo en la encriptación de la contraseña" });
      const values = [
        req.body.Nombre,
        req.body.Apellido,
        req.body.Tel,
        req.body.NumeroDocumento,
        req.body.Correo,
        req.body.TipoTurno,
        hash,
      ];
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error en la consulta:", err); // Muestra el error en el servidor
          return res
            .status(500)
            .json({ Error: "Error al enviar solicitud de registro" });
        }
        return res.json({ Status: "Success" });
      });
    });
  });

  //---------------------------------------------------------//

  // Crud parqueaderos
  // Consultar Parqeuaderos
  router.get("/getParqueadero", (req, res) => {
    const sql = "SELECT * FROM espacios_parqueadero";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Consultar parqueaderos específico
  router.post("/getParqueaderoEsp1", (req, res) => {
    console.log(req.body);
    const sql = "SELECT * FROM espacios_parqueadero WHERE numEspacio = ?";
    db.query(sql, [req.body.Term], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al buscar apartamento" });
      }
      res.json(data);
    });
  });

  // Consultar parqueaderos específico
  router.post("/getParqueaderoEsp2", (req, res) => {
    console.log(req.body);
    const sql = "SELECT * FROM espacios_parqueadero WHERE tipoEspacio = ?";
    db.query(sql, [req.body.Term], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al buscar apartamento" });
      }
      res.json(data);
    });
  });

  // Insertar parqueaderos
  router.post("/postParqueadero", (req, res) => {
    console.log(req);
    const sql = "Call Insertar_parqueadero(?)";
    const values = [req.body.NumeroEspacio, req.body.TipoEspacio];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Actualizar propietarios
  router.post("/patchParqueadero", (req, res) => {
    console.log(req.body);
    const sql = "Call Actualizar_parqueadero(?)";
    const values = [
      req.body.NumeroEspacio,
      req.body.TipoEspacio,
      req.body.Estado,
    ];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al actualizar el apartamento" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Eliminar propietarios
  router.post("/deleteParqueadero", (req, res) => {
    console.log(req.body);
    const sql = "DELETE FROM espacios_parqueadero WHERE numEspacio = ?";
    const values = [req.body.NumeroEspacio];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Al eliminar el registro:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al eliminar el registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  //-----------------------------------------------------------//

  // Crud Invitados
  // Consultar Invitados
  router.get("/getInvitados", (req, res) => {
    const sql = "SELECT * FROM get_invitados";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Consultar específica Invitados
  router.post("/getInvitadosEsp", (req, res) => {
    const sql = "SELECT * FROM get_invitados Where numDocumento = ?";
    db.query(sql, [req.body.Term], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Inserción Invitados
  router.post("/postInvitados", (req, res) => {
    console.log(req);
    const sql = "Call Inserción_Invitados(?)";
    bcrypt.hash(req.body.NumeroDocumento.toString(), salt, (err, hash) => {
      if (err)
        return res.json({ Error: "Fallo en la encriptación de la contraseña" });
      const values = [
        req.body.Nombre,
        req.body.Apellido,
        req.body.Teléfono,
        req.body.NumeroDocumento,
        req.body.Correo,
        req.body.CodigoVivienda,
        req.body.EspacioParqueadero,
        req.body.Placa,
      ];
      db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error en la consulta:", err); // Muestra el error en el servidor
          return res
            .status(500)
            .json({ Error: "Error al enviar solicitud de registro" });
        }
        return res.json({ Status: "Success" });
      });
    });
  });

  // Actualizar Invitados
  router.post("/patchInvitados", (req, res) => {
    console.log(req.body);
    const sql = "Call Actualizar_Invitados(?)";
    const values = [
      req.body.Teléfono,
      req.body.Correo,
      req.body.EspacioParqueadero,
      req.body.Placa,
      req.body.NumeroDocumento,
      req.body.CodigoVivienda,
      req.body.CodigoViviendaOld,
    ];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al actualizar el apartamento" });
      }
      return res.json({ Status: "Success" });
    });
  });

  // Eliminar Invitados
  router.post("/deleteInvitados", (req, res) => {
    console.log(req.body);
    const sql = "Call Eliminar_Invitado(?)";
    const values = [req.body.NumeroDocumento];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Al eliminar el registro:", err); // Muestra el error en el servidor
        return res.status(500).json({ Error: "Error al eliminar el registro" });
      }
      return res.json({ Status: "Success" });
    });
  });

  //--------------------------------------------------//
  // Crud Salon comunal
  // Consultar Salon comunal
  router.get("/getReservaSalon", (req, res) => {
    const sql = "SELECT * FROM espacios_parqueadero";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      res.json(data);
    });
  });

  // Agregar el router al prefijo /users
  app.use("/admin", router);
};

export default routerAdmin;
