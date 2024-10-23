import { useEffect, useState } from "react";
import axios from "axios";

const ValidationReg = (values, data, apiS) => {

  const getCode = data.some(
    (item) => item.codigoVivienda === parseInt(values.CodigoVivienda, 10)
  );

  let errors = {};
  // Validaciones

  if (apiS === "Apartamentos") {
    const getCodeAdmin = data.some(
      (item) =>
        item.codigoVivienda ===
        parseInt(`${values.Bloque}${values.Torre}${values.numAprt}`, 10)
    );
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

    if (getCodeAdmin && !values.codApt) {
      errors.CodigoVivienda = "Esta vivienda ya se encuentra en el sistema";
    } else errors.Valid = "valid";
  }

  if (apiS === "Propietarios") {
    const first3 = values.Placa.slice(0, 3);

    const last3 = values.Placa.slice(4, 7);

    const separator = values.Placa.slice(4, 5);

    const verMayus = /^[A-Z]{3}$/.test(first3);

    const verNums = /^[1-9]{3}$/.test(last3);

    console.log(separator);
    console.log(first3);
    console.log(last3);

    console.log(verMayus);
    console.log(verNums);

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

    if (values.Placa.length > 7) {
      errors.Placa = "Valores < 7";
    } else errors.Valid = "valid";

    if (!values.CodigoVivienda) {
      errors.CodigoVivienda = "Ingrese su codigo de vivienda";
    } else if (values.CodigoVivienda.length > 10) {
      errors.CodigoVivienda = "Valores < 50";
    } else if (!getCode) {
      errors.CodigoVivienda = "Vivienda no registrada en el sistema";
    } else errors.Valid = "valid";

    if (values.EspacioParqueadero.length > 2) {
      errors.EspacioParqueadero = "Valores entre 1 y 99";
    } else if (!getCode) {
      errors.EspacioParqueadero = "Vivienda no registrada en el sistema";
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
