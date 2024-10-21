import express from "express";
import bcrypt from "bcrypt";

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
    const values = [req.body.Usuario];
    db.query(sql, [values], (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      if (data.length > 0 && data[0].Pass) {
        return res.json({ Status: "Success" });
      } else {
        return res.json({
          Error: "Nombre de usuario o contraseña incorrectos",
        });
      }
    });
  });

  // Ruta para consulta de solicitudes para creación de cuenta
  router.get("/Solicitudes", (req, res) => {
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

  // Agregar el router al prefijo /users
  app.use("/admin", router);
};

export default routerAdmin;
