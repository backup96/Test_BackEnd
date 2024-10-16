const Validation = (values) => {

  let errors = {};

  // Validaciones
  if (!values.name) {
    errors.name = "Ingrese su nombre de usuario";
  } else {
    errors.name = "";
  }
console.log(values.password)
  if (values.password === "") {
    errors.password = "Ingrese su contraseña";
  } else if (values.password[0].length < 6 || values.password[0].length > 15) {
    errors.password = "La contraseña debe tener entre 6 y 15 caracteres";
  } else {
    errors.password = "";
  }

  return errors;
};

export default Validation;