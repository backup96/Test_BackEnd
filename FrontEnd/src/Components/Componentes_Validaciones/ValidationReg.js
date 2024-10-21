const ValidationReg = (values, data, apiS) => {

  const getCode = data.some(
    (item) => item.codigoVivienda === parseInt(values.CodigoVivienda, 10)
  );

  let errors = {};
  // Validaciones
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

  if (!values.TipoTurno) {
    errors.TipoTurno = "Ingrese un tipo de turno";
  } else errors.Valid = "valid";

  if (!apiS) {
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
