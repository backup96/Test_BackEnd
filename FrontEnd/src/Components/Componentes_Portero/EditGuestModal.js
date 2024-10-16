import React, { useState, useEffect } from "react";
import axios from 'axios';

const EditGuestModal = ({ showModal, handleClose, guestToEdit, refreshData }) => {
  const [guestData, setGuestData] = useState({
    Nombre: "",
    NumeroDocumento: "",
    Teléfono: "",
    Correo: "",
    NumeroParqueadero: "",
    Costo: "",
    CodigoVivienda: ""
  });

  useEffect(() => {
    if (guestToEdit) {
      setGuestData(guestToEdit);
    }
  }, [guestToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGuestData({ ...guestData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/Invitados/${guestData.id}`, guestData);
      alert("Invitado editado correctamente.");
      handleClose();
      refreshData(); // Actualiza la lista después de editar
    } catch (error) {
      console.error("Error al editar el invitado:", error);
    }
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`} role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Invitado</h5>
            <button type="button" className="close" onClick={handleClose}>
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" className="form-control" id="Nombre" name="Nombre" value={guestData.Nombre} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="documento">Número de Documento</label>
                <input type="text" className="form-control" id="NumeroDocumento" name="NumeroDocumento" value={guestData.NumeroDocumento} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input type="text" className="form-control" id="Teléfono" name="Teléfono" value={guestData.Teléfono} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="correo">Correo</label>
                <input type="email" className="form-control" id="Correo" name="Correo" value={guestData.Correo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="parqueadero">Número de Parqueadero</label>
                <input type="text" className="form-control" id="NumeroParqueadero" name="NumeroParqueadero" value={guestData.NumeroParqueadero} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="costo">Costo</label>
                <input type="number" className="form-control" id="Costo" name="Costo" value={guestData.Costo} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="vivienda">Código de Vivienda</label>
                <input type="text" className="form-control" id="CodigoVivienda" name="CodigoVivienda" value={guestData.CodigoVivienda} onChange={handleChange} required />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={handleClose}>Cerrar</button>
              <button type="submit" className="btn btn-warning">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGuestModal;
