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
app.use(
  cors({
    // origin: ["http://localhost:3001/LoginPropietario"],
  })
);
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
  console.log(req)
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
    if (data.length > 0 && data[0].Pass) {
      return res.json({ Status: "Success" });
    } else {
      return res.json({
        Error: "Nombre de usuario o contraseña incorrectos",
      });
    }
  });
});

// Ruta para inicio de sesión en propietario
app.post("/loginPropietario", (req, res) => {
  const sql = "SELECT * FROM login_propietario WHERE nombreUsuario = ?";
  db.query(sql, [req.body.Usuario], (err, data) => {
    if (err) {
      console.error("Error al iniciar sesión", err); // Muestra el error en el servidor
      return res
        .status(500)
        .json({ Error: "Error al enviar solicitud de registro" });
    }
    if (data.length > 0) {
      bcrypt.compare(req.body.Pass.toString(), data[0].clave, (err, response) => {
        if(err) return res.json({Error: "Error al comparar constraseñas"});
        if (response) {
          // const Usuario = data[0].Usuario;
          // const token = jwt.sign({ Usuario }, "jwt-secret-key", {expiresIn: '1d'});
          return res.json({Status: "Success"});
        } else {
          return res.json({Error: "Las constraseñas no coinciden"})
        }
      });
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
