import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import DateTime from "./DateTime.js";
import multer from "multer";

const salt = 10;

dotenv.config({ path: "./.env" });

// Configurar Multer
const storage = multer.memoryStorage(); // Almacenar el archivo en memoria
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

// Ruta para envio de solicitud de cuenta
app.post("/register", upload.single("Archivo"), (req, res) => {
  console.log(req)
  const { Nombre, Apellido, NumeroDocumento, Tel, Correo, CodigoVivienda } =
    req.body;
  const file = req.file.buffer;
  const sql = "Call Creacion_solicitud_cuenta(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [
      DateTime().fecha,
      DateTime().hora,
      Nombre,
      Apellido,
      NumeroDocumento,
      Tel,
      Correo,
      CodigoVivienda,
      file,
    ],
    (err, data) => {
      if (err) {
        console.error("Error en la consulta:", err); // Muestra el error en el servidor
        return res
          .status(500)
          .json({ Error: "Error al enviar solicitud de registro" });
      }
      return res.json(data);
    }
  );
});

// Ruta para confirmación de creación de cuenta
app.post("/confirmAcc", (req, res) => {
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
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM login_admin WHERE nombreUsuario = ?";
  const values = [req.body.Usuario];
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error en la consulta:", err); // Muestra el error en el servidor
      return res
        .status(500)
        .json({ Error: "Error al enviar solicitud de registro" });
    }
    console.log(data);
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
app.get("/Solicitudes", (req, res) => {
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

// Ruta para consulta de apartamentos
app.get("/Apartamentos", (req, res) => {
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

// Ruta para obtener el archivo PDF desde la base de datos
app.get("/descargar/:id", (req, res) => {
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

// Ruta para login de usuario
app.post("/personas_cuenta", (req, res) => {
  const sql =
    "SELECT * FROM personas_cuenta WHERE nombreUsuario = ? AND clave = ?";
  db.query(sql, [req.body.nombreUsuario, req.body.clave], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Success");
    } else {
      return res.json("Failed");
    }
  });
});

app.listen(8081, () => {
  console.log("Servidor corriendo en el puerto 8081");
});
