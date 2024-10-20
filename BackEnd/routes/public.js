import express from "express";

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

  // Agregar el router al prefijo /users
  app.use("/public", router);
};

export default routerPublic;
