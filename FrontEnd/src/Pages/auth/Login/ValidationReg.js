const ValidationReg = (values) => {
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

  if (!values.CodigoVivienda) {
    errors.CodigoVivienda = "Ingrese su numero de correo";
  } else if (values.CodigoVivienda.length > 10) {
    errors.CodigoVivienda = "Valores < 50";
  } else errors.Valid = "valid";

  if (!values.Archivo) {
    errors.Archivo = "Seleccone un archivo de autenticación";
  } else if (values.Archivo.size / 1048576 > 32) {
    errors.Archivo = "Archivos < 32 MB";
  } else errors.Valid = "valid";

  return errors;
};

export default ValidationReg;
