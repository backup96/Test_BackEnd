import express from "express";
import mysql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routerPropietario from "./routes/propietario.js";
import routerAdmin from "./routes/admin.js";
import routerPublic from "./routes/public.js";
import nodemailer from "nodemailer"

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

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

routerPropietario(app, db);

routerAdmin(app, db);

routerPublic(app, db, transporter);


// Ruta para vista parqueadero-propietario
app.get("/espacio_parqueadero", (req, res) => {
  const tipoEspacio = req.query.tipoEspacio;
  let sql = "SELECT * FROM espacio_parqueadero";
  let params = [];

  if (tipoEspacio) {
      sql += " WHERE tipoEspacio = ?";
      params.push(tipoEspacio);
  }

  db.query(sql, params, (err, data) => {
      if (err) {
          console.error("Error en la consulta:", err);
          return res.status(500).json({ status: 'error', message: "Error al obtener los datos" });
      }
      console.log("Datos devueltos:", data); // Agregar logging aquí
      return res.json({ status: 'success', data });
  });
});


// Ruta para calendario-propietario
app.post('/citas_salon_comunal', (req, res) => {
  const { nombreUsuario, numeroDoc, telefono, codigoVivienda, horarioInicio, horarioFin, motivoReunion, Fecha } = req.body;
  const sql = `
    INSERT INTO citas_salon_comunal (nombreUsuario, numeroDoc, telefono, codigoVivienda, horarioInicio, horarioFin, motivoReunion, Fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [nombreUsuario, numeroDoc, telefono, codigoVivienda, horarioInicio, horarioFin, motivoReunion, Fecha], (err, results) => {
    if (err) {
      console.error("Error al insertar la reserva:", err);
      return res.status(500).json({ message: "Error al realizar la reserva" });
    }
    return res.status(201).json({ id: results.insertId }); 
  });
});


app.get("/citas_salon_comunal", (req, res) => {
  const userDoc = req.query.numeroDoc; 
  const sql = "SELECT * FROM citas_salon_comunal";
  
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener las citas" });
    }
    
    const formattedData = data.map(cita => ({
      ...cita,
      Fecha: new Date(cita.Fecha).toISOString().split('T')[0],
      esPropia: cita.numeroDoc === userDoc // Indica si la reserva pertenece al usuario actual
    }));
    
    return res.status(200).json(formattedData);
  });
});

// app.get("/propietarios", (req, res) => {
//   const { nombreUsuario, clave } = req.query; 
//   const sql = `
//     SELECT p.*
//     FROM propietario p
//     INNER JOIN personas_cuenta pc ON p.idPersonaCuentaFK = pc.idPersonaCuenta
//     WHERE pc.nombreUsuario = ? AND pc.clave = ?
//     LIMIT 0, 25
//   `;
//   db.query(sql, [nombreUsuario, clave], (err, results) => {
//     if (err) {
//       console.error("Error al obtener propietarios:", err);
//       return res.status(500).json({ message: "Error al obtener los propietarios" });
//     }
//     return res.status(200).json(results);
//   });
// });


// Ruta para datos del propietario (Perfil)
// Obtener datos del propietario y la persona asociada
app.get('/propietario/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
      SELECT pr.idPropietario, pr.idPersonaCuentaFK,
             p.nombre, p.apellido, p.telefono, p.numDocumento, 
             p.correo, p.idTipoDocumentoFK, p.idParqueaderoFK, 
             p.placaVehiculo
      FROM propietario pr
      INNER JOIN personas p ON pr.idPersonaCuentaFK = p.numDocumento
      WHERE pr.idPropietario = ?
  `;
  
  db.query(sql, [id], (err, data) => {
      if (err) {
          console.error('Error en la consulta:', err);
          return res.status(500).json({ 
              message: "Error al obtener los datos del propietario y persona" 
          });
      }
      return res.status(200).json(data[0]); // Devolvemos solo el primer registro
  });
});

app.patch('/persona/:numDocumento', (req, res) => {
  const { numDocumento } = req.params;
  const { telefono, correo } = req.body;

  const sql = "UPDATE personas SET telefono = ?, correo = ? WHERE numDocumento = ?";
  
  db.query(sql, [telefono, correo, numDocumento], (err) => {
      if (err) {
          console.error('Error en la actualización:', err);
          return res.status(500).json({ 
              message: "Error al actualizar los datos de la persona" 
          });
      }
      return res.status(200).json({ message: "Datos actualizados correctamente" });
  });
});



app.listen(8081, () => {
  console.log("Servidor corriendo en el puerto 8081");
});
