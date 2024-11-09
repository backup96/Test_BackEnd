import { useEffect, useState } from "react";
import axios from "axios";

const ValidationReg = (values, data, data2, apiS) => {
  const getCode = data.some(
    (item) => item.codigoVivienda === parseInt(values.CodigoVivienda, 10)
  );

  let errors = {};
  // Validaciones

  if (apiS === "Apartamentos") {
    if (!values.Bloque) {
      errors.Bloque = "Ingrese el bloque del apartemento";
    } else if (values.Bloque.length > 2) {
      errors.Bloque = "Valores < 2 caracteres";
    } else if (values.Bloque < 1) {
      errors.Bloque = "Ingrese un valor positivo";
    } else errors.Valid = "valid";

    if (!values.Torre) {
      errors.Torre = "Ingrese la torre del apartemento";
    } else if (values.Torre.length > 2) {
      errors.Torre = "Valores < 2";
    } else if (values.Torre < 1) {
      errors.Torre = "Ingrese un valor positivo";
    } else errors.Valid = "valid";

    if (!values.numAprt) {
      errors.numAprt = "Ingrese el numero del apartemento";
    } else if (values.numAprt.length > 4) {
      errors.numAprt = "Valores < 4";
    } else if (values.numAprt < 1) {
      errors.numAprt = "Ingrese un valor positivo";
    } else errors.Valid = "valid";
  }

  if (apiS === "Propietarios" || apiS === "Invitados") {
    const getEsp = data2.some(
      (item) => item.numEspacio === parseInt(values.EspacioParqueadero, 10)
    );
    const getNumDoc = data.some(
      (item) =>
        item.codigoVivienda ===
        parseInt(`${values.Bloque}${values.Torre}${values.numAprt}`, 10)
    );
    const first3 = values.Placa.slice(0, 3);

    const last3 = values.Placa.slice(4, 7);

    const separator = values.Placa.slice(3, 4);

    const verMayus = /^[A-Z]{3}$/.test(first3);

    const verNums = /^[1-9]{3}$/.test(last3);

    const verSep = /^[-]{1}$/.test(separator);

    if (!values.Nombre) {
      errors.Nombre = "Ingrese su nombre";
    } else if (values.Nombre.length > 30) {
      errors.Nombre = "Valores < 30";
    } else errors.Valid = "valid";

    if (!values.Apellido) {
      errors.Apellido = "Ingrese su apellido";
    } else if (values.Apellido.length > 30) {
      errors.Apellido = "Valores < 30";
    } else errors.Valid = "valid";

    if (!values.NumeroDocumento) {
      errors.NumeroDocumento = "Ingrese su numero de documento";
    } else if (values.NumeroDocumento.length > 10) {
      errors.NumeroDocumento = "Valores < 10";
    } else errors.Valid = "valid";

    if (!values.Teléfono) {
      errors.Teléfono = "Ingrese su numero de teléfono";
    } else if (values.Teléfono.length > 15) {
      errors.Teléfono = "Valores < 15";
    } else errors.Valid = "valid";

    if (!values.Correo) {
      errors.Correo = "Ingrese su numero de correo";
    } else if (values.Correo.length > 50) {
      errors.Correo = "Valores < 50";
    } else errors.Valid = "valid";

    if (values.Placa.length > 7 && values.Placa !== "No posee") {
      errors.Placa = "Valores < 7";
    } else if (
      (!verMayus || !verNums || !verSep) &&
      values.Placa !== "No posee"
    ) {
      errors.Placa = "Siga el ejemplo: AAA-111";
    } else errors.Valid = "valid";

    if (!values.CodigoVivienda) {
      errors.CodigoVivienda = "Ingrese su codigo de vivienda";
    } else if (values.CodigoVivienda.length > 10) {
      errors.CodigoVivienda = "Valores < 50";
    } else if (!getCode) {
      errors.CodigoVivienda = "Vivienda no registrada en el sistema";
    } else errors.Valid = "valid";
console.log(values.EspacioParqueadero)
    if (values.EspacioParqueadero !== null) {
      if (values.EspacioParqueadero.length > 2) {
        errors.EspacioParqueadero = "Valores entre 1 y 99";
      } else if (!getEsp) {
        errors.EspacioParqueadero = "Espacio no registrado en el sistema";
      }
    }  else errors.Valid = "valid";
  }

  if (apiS === "Parqueadero") {
    if (!values.NumeroEspacio) {
      errors.NumeroEspacio = "Ingrese el numero de espacio";
    } else if (values.NumeroEspacio.length > 3) {
      errors.NumeroEspacio = "Valores entre 1 y 99";
    } else errors.Valid = "valid";

    if (!values.TipoEspacio) {
      errors.TipoEspacio = "Seleccione un tipo de espacio";
    } else errors.Valid = "valid";
  }

  if (apiS === "Porteros" || apiS === "") {
    if (!values.Nombre) {
      errors.Nombre = "Ingrese su nombre";
    } else if (values.Nombre.length > 30) {
      errors.Nombre = "Valores < 30";
    } else errors.Valid = "valid";

    if (!values.Apellido) {
      errors.Apellido = "Ingrese su apellido";
    } else if (values.Apellido.length > 30) {
      errors.Apellido = "Valores < 30";
    } else errors.Valid = "valid";

    if (!values.NumeroDocumento) {
      errors.NumeroDocumento = "Ingrese su numero de documento";
    } else if (values.NumeroDocumento.length > 10) {
      errors.NumeroDocumento = "Valores < 10";
    } else errors.Valid = "valid";

    if (!values.Tel) {
      errors.Tel = "Ingrese su numero de teléfono";
    } else if (values.Tel.length > 15) {
      errors.Tel = "Valores < 15";
    } else errors.Valid = "valid";

    if (!values.Correo) {
      errors.Correo = "Ingrese su numero de correo";
    } else if (values.Correo.length > 50) {
      errors.Correo = "Valores < 50";
    } else errors.Valid = "valid";

    if (apiS === "Porteros") {
      if (!values.TipoTurno) {
        errors.TipoTurno = "Ingrese un tipo de turno";
      } else errors.Valid = "valid";
    }
  }

  if (apiS === "ReservaSalon") {
    const getSc = data.some((item) => item.Fecha.slice(0, 10) === values.Dia);
    const h = parseInt(values.HoraInicio.slice(0, 2), 10);
    const m = parseInt(values.HoraInicio.slice(3, 5), 10);
    const s = !parseInt(values.HoraInicio.slice(6, 8), 10)
      ? 0
      : parseInt(values.HoraInicio.slice(6, 8), 10);
    const time1 = h * 3600 + m * 60 + s;
    const hf = parseInt(values.HoraFin.slice(0, 2), 10);
    const mf = parseInt(values.HoraFin.slice(3, 5), 10);
    const sf = !parseInt(values.HoraFin.slice(6, 8), 10)
      ? 0
      : parseInt(values.HoraFin.slice(6, 8), 10);
    const time2 = hf * 3600 + mf * 60 + sf;

    if (time1 < 32400 || time1 > 84600) {
      errors.HoraInicio =
        "Hora de inicio y final entre las 9:00 AM y las 11:30 PM.";
    } else errors.Valid = "valid";

    if (time2 < 32400 || time2 > 84600) {
      errors.HoraInicio =
        "Hora de inicio y final entre las 9:00 AM y las 11:30 PM.";
    } else errors.Valid = "valid";

    if (!values.Dia) {
      errors.Dia = "Ingrese una fecha";
    } else if (getSc) {
      if (values.Dia === values.DiaOld) {
        errors.Valid = "valid";
      } else errors.Dia = "Este dia ya esta rentado";
    } else errors.Valid = "valid";
  }

  if (apiS === "") {
    if (!values.CodigoVivienda) {
      errors.CodigoVivienda = "Ingrese su codigo de vivienda";
    } else if (values.CodigoVivienda.length > 10) {
      errors.CodigoVivienda = "Valores < 50";
    } else if (!getCode) {
      errors.CodigoVivienda = "Vivienda no registrada en el sistema";
    } else errors.Valid = "valid";

    if (!values.Archivo) {
      errors.Archivo = "Seleccone un archivo de autenticación";
    } else if (values.Archivo.size / 1048576 > 32) {
      errors.Archivo = "Archivos < 32 MB";
    } else errors.Valid = "valid";
  }

  return errors;
};

export default ValidationReg;
