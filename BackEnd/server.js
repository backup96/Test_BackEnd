import express from 'express'
import mysql from 'mysql2'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv';
import DateTime from './DateTime.js'
import multer from 'multer'

dotenv.config({path: './.env'});

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

// Ruta para insertar datos de registro (por si la usas en otro contexto)
app.post('/register', (req, res) => {
    const sql = "Call Creacion_solicitud_cuenta(?)";
    const values = [
      DateTime().fecha,
      DateTime().hora,
      req.body.Nombre,
      req.body.Apellido,
      req.body.NumeroDocumento,
      req.body.Teléfono,
      req.body.Correo,
      req.body.CodigoVivienda,
      req.body.Archivo,
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
          console.error("Error en la consulta:", err); // Muestra el error en el servidor
          return res
            .status(500)
            .json({ Error: "Error al enviar solicitud de registro" });
        }
        return res.json(data);
    });
});

// Ruta para login de usuario
app.post('/personas_cuenta', (req, res) => {
    const sql = "SELECT * FROM personas_cuenta WHERE nombreUsuario = ? AND clave = ?"; 
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
