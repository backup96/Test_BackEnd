const ValidationPass = (values) => {
  let errors = {};

  if (!values.Correo) {
    errors.Correo = "Ingrese su correo electrónico";
  } else {
    errors.Valid = "valid";
  }

  return errors;
};

export default ValidationPass;
