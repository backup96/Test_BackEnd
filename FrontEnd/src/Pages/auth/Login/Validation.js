const Validation = (values) => {

  let errors = {};

  // Validaciones
  if (!values.nombreUsuario) {
    errors.nombreUsuario = "Ingrese su nombre de usuario";
  } else {
    errors.Valid = "valid";
  }

  if (values.clave === "") {
    errors.clave = "Ingrese su contraseña";
  } else {
    errors.Valid = "valid";
  }

  return errors;
};

export default Validation;