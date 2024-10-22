import express from "express";
import jwt from "jsonwebtoken";


const routerPublic = (app, db) => {
  const router = express.Router();

  

  // Ruta para consulta de apartamentos
  router.get("/Apartamentos", (req, res) => {
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

  // Función para verificar una sesión iniciada
  const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ Error: "No hay una sesión iniciada" });
    } else {
      jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
          return res.json({ Error: "Error con el token" });
        } else {
          req.nombreUsuario = decoded.nombreUsuario;
          next();
        }
      });
    }
  };

  router.get("/", verifyUser, (req, res) => {
    return res.json({ Status: "Success", nombreUsuario: req.nombreUsuario });
  });

  // Ruta para limpiar cookies creadas y cerrar sesión
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ Status: "Success" });
  });


 

  // Agregar el router al prefijo /users
  app.use("/public", router);
};

export default routerPublic;