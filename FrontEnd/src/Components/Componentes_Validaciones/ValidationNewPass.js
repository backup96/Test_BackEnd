const ValidationNewPass = (values) => {
  let errors = {};

  if (!values.Pass) {
    errors.Pass = "Ingrese una nueva contraseña";
  } else if (values.Pass.length < 8) {
    errors.Pass = "Ingrese minimo 8 caracteres";
  } else {
    errors.Valid = "valid";
  }

  if (!values.RecPass) {
    errors.RecPass = "Porfavor, repita su contraseña";
  }
  if (values.Pass !== values.RecPass) {
    errors.RecPass = "Las contraseñas no coinciden";
  } else {
    errors.Valid = "valid";
  }

  return errors;
};

export default ValidationNewPass;
