const Validation = (values) => {

  let errors = {};

  // Validaciones
  if (!values.Usuario) {
    errors.Usuario = "Ingrese su nombre de usuario";
  } else if (values.Usuario.length > 41) {
    errors.Usuario = "Valores < 41 carácteres";
  } else {
    errors.Valid = "valid";
  }

  if (values.Pass === "") {
    errors.Pass = "Ingrese su contraseña";
  } else if (values.Pass.length > 41) {
    errors.Pass = "Valores < 41 carácteres";
  } else {
    errors.Valid = "valid";
  }

  return errors;
};

export default Validation;