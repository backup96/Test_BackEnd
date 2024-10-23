import express from "express";
import mysql from "mysql2";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import routerPropietario from "./routes/propietario.js";
import routerAdmin from "./routes/admin.js";
import routerPublic from "./routes/public.js";
import routerPortero from "./routes/portero.js";
import nodemailer from "nodemailer";
import bcrypt from 'bcrypt';
const saltRounds = 10;


dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Añadido PUT y OPTIONS
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // Añadido headers permitidos
  })
);
app.options('*', cors());

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

routerPortero(app, db);

// Ruta para vista parqueadero-propietario
app.get("/espacio_parqueadero", (req, res) => {
  const tipoEspacio = req.query.tipoEspacio;
  let sql = "SELECT * FROM espacios_parqueadero";
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

app.put('/rentar_espacio', (req, res) => {
  console.log(req.body);
  const { name, numEspacio } = req.body;
  const estadoOcupado = "Ocupado";

  // Primero verificamos si el espacio está disponible
  const sqlCheckEspacio = `
    SELECT numEspacio, estado 
    FROM espacios_parqueadero 
    WHERE numEspacio = ?`;
  
  db.query(sqlCheckEspacio, [numEspacio], (err, espacioResult) => {
    if (err) {
      console.error("Error al verificar el espacio:", err.message);
      return res.status(500).json({ error: err.message });
    }

    if (espacioResult.length === 0) {
      return res.status(404).json({ error: "Espacio no encontrado" });
    }

    if (espacioResult[0].estado === "Ocupado") {
      return res.status(400).json({ error: "El espacio ya está ocupado" });
    }

    // Si está disponible, actualizamos el estado del espacio
    const sqlUpdateEspacio = `
      UPDATE espacios_parqueadero 
      SET estado = ? 
      WHERE numEspacio = ?`;
    
    db.query(sqlUpdateEspacio, [estadoOcupado, numEspacio], (err, updateResult) => {
      if (err) {
        console.error("Error al actualizar el espacio:", err.message);
        return res.status(500).json({ error: err.message });
      }

      // Actualizamos la tabla personas con el id del espacio
      const sqlUpdatePersona = `
        UPDATE rentar_espacio 
        SET idParqueaderoFk = ? 
        WHERE nombreUsuario = ?`;
      
      db.query(sqlUpdatePersona, [espacioResult[0].id, name], (err, personaResult) => {
        if (err) {
          console.error("Error al actualizar la persona:", err.message);
          // Si hay error, revertimos el cambio en espacios_parqueadero
          db.query(
            "UPDATE espacios_parqueadero SET estado = 'Disponible' WHERE numEspacio = ?", 
            [numEspacio]
          );
          return res.status(500).json({ error: err.message });
        }

        if (personaResult.affectedRows === 0) {
          // Si no se actualizó ninguna persona, revertimos el cambio en espacios_parqueadero
          db.query(
            "UPDATE espacios_parqueadero SET estado = 'Disponible' WHERE numEspacio = ?", 
            [numEspacio]
          );
          return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ 
          status: 'success',
          message: "Espacio de parqueadero rentado exitosamente." 
        });
      });
    });
  });
});







// Ruta para calendario-propietario
app.post('/citas_salon_comunal', (req, res) => {
  const { numDocumento, horarioInicio, horarioFin, motivoReunion, Fecha } = req.body;
  const sql = `
    INSERT INTO citas_salon_comunal ( numDocumento, horarioInicio, horarioFin, motivoReunion, Fecha)
    VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [numDocumento, horarioInicio, horarioFin, motivoReunion, Fecha], (err, results) => {
    if (err) {
      console.error("Error al insertar la reserva:", err);
      return res.status(500).json({ message: "Error al realizar la reserva" });
    }
    return res.status(201).json({ id: results.insertId }); 
  });
});

app.get("/citas_salon_comunal", (req, res) => {
  const userDoc = req.query.numDocumento;

  // Si no se proporciona numDocumento, traer todas las citas
  const sql = "SELECT * FROM citas_salon_comunal";
  
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).json({ 
        message: "Error al obtener las citas",
        error: err 
      });
    }

    // Convertir el userDoc a string para comparación consistente
    const userDocString = String(userDoc);
    
    const formattedData = data.map(cita => ({
      ...cita,
      Fecha: new Date(cita.Fecha).toISOString().split('T')[0],
      numDocumento: String(cita.numDocumento),
      esPropia: String(cita.numDocumento) === userDocString
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
app.post('/vista_perfil', (req, res) => {
  const nombreUsuario = req.body.name;
  const sql = "SELECT * FROM vista_perfil WHERE nombreUsuario = ?";
  db.query(sql, [nombreUsuario], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err.message); 
      return res.status(500).json({ error: err.message });
    }
    console.log("Datos obtenidos:", results); 
    res.json(results);
  });
});

// Actualizar ddatos del perfil
app.post('/actualizar_perfil', (req, res) => {
  const { telefono, correo, nombreUsuario } = req.body;

  console.log("Datos a actualizar:", { telefono, correo, nombreUsuario });

  const sql = "UPDATE vista_perfil SET telefono = ?, correo = ? WHERE nombreUsuario = ?";
  db.query(sql, [telefono, correo, nombreUsuario], (err, results) => {
    if (err) {
      console.error("Error en la consulta:", err.message);
      return res.status(500).json({ error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    // console.log("Perfil actualizado:", results);
    res.json({ message: "Perfil actualizado exitosamente" });
  });
});
// CAMBIAR CONTRASEÑA CON ENCRIPTACIÓN EN PERFIL PROP
app.post('/cambiar_contrasena', async (req, res) => {
  const { newPassword, nombreUsuario } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    const sql = "UPDATE personas_cuenta SET clave = ? WHERE nombreUsuario = ?";
    
    db.query(sql, [hashedPassword, nombreUsuario], (err, results) => {
      if (err) {
        console.error("Error al actualizar la contraseña:", err);
        return res.status(500).json({ 
          error: "Error al actualizar la contraseña" 
        });
      }
      
      if (results.affectedRows === 0) {
        return res.status(404).json({ 
          error: "Usuario no encontrado" 
        });
      }
      
      // Solo enviamos una respuesta exitosa
      return res.status(200).json({ 
        message: "Contraseña actualizada exitosamente" 
      });
    });
    
  } catch (error) {
    console.error("Error al encriptar la contraseña:", error);
    return res.status(500).json({ 
      error: "Error al procesar la contraseña" 
    });
  }
});




app.listen(8081, () => {
  console.log("Servidor corriendo en el puerto 8081");
});
