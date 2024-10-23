import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const routerPortero = (app, db) => {
  const router = express.Router();

  // Ruta para inicio de sesión en portero
  router.post("/loginPortero", (req, res) => {
    const sql = "SELECT * FROM login_portero WHERE nombreUsuario = ?";
    db.query(sql, [req.body.nombreUsuario], (err, data) => {
      if (err) {
        console.error("Error al iniciar sesión", err); // Muestra el error en el servidor
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
          Error: "Nombre de Usuario o contraseña incorrectos",
        });
      }
    });
  });

  app.use("/portero", router);
};

export default routerPortero;
