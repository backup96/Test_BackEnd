const Validation = (values) => {

  let errors = {};

  // Validaciones
  if (!values.Usuario) {
    errors.Usuario = "Ingrese su nombre de usuario";
  } else {
    errors.Valid = "valid";
  }

  if (values.Pass === "") {
    errors.Pass = "Ingrese su contraseña";
  } else {
    errors.Valid = "valid";
  }

  return errors;
};

export default Validation;