import express from "express";
import mysql from "mysql2";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routerPropietario from "./routes/propietario.js";
import routerAdmin from "./routes/admin.js";
import routerPublic from "./routes/public.js";

dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE,
});

routerPropietario(app, db);

routerAdmin(app, db);

routerPublic(app, db);

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "No hay una sesión iniciada" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Error con el token" });
      } else {
        req.Usuario = decoded.Usuario;
        next();
      }
    });
  }
};

// Ruta
app.get("/", verifyUser, (req, res) => {
  return res.json({ Status: "Success", Usuario: req.Usuario });
});

//
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.listen(8081, () => {
  console.log("Servidor corriendo en el puerto 8081");
});
