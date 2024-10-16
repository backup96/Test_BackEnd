import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './Calendario.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Calendario = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [formData, setFormData] = useState({
    Nombre: '',
    NumeroDocumento: '',
    Telefono: '',
    CodigoVivienda: '',
    HoraInicio: '',
    HoraFin: '',
    Motivo: ''
  });
  const [reservas, setReservas] = useState([]);
  const [formErrors, setFormErrors] = useState({
    Nombre: '',
    NumeroDocumento: '',
    Telefono: '',
    CodigoVivienda: '',
    Motivo: ''
  });

  const propietarioActual = formData.NumeroDocumento;

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get('http://localhost:4000/ReservaSalon');
        const formattedReservas = response.data.map(res => ({
          ...res,
          Fecha: new Date(res.Fecha).toISOString().split('T')[0]
        }));
        setReservas(formattedReservas);
      } catch (error) {
        console.error('Error al obtener las reservas', error);
        toast.error('Error al obtener las reservas');
      }
    };
    fetchReservas();
  }, []);
  
  // Función para verificar si una fecha ya está reservada
  const isDateReserved = (date) => reservas.some(res => res.Fecha === date);
  
  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (isDateReserved(formattedDate)) {
      toast.error("Este día ya está reservado.");
      return;
    }
    setSelectedDate(formattedDate);
    setShowModal(true);
  };
  
  const handleModalClose = () => setShowModal(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    let errorMessage = '';
  
    if (name === "Nombre" && !/^[a-zA-Z\s]*$/.test(value)) {
      errorMessage = "El nombre solo puede contener letras y espacios.";
      isValid = false;
    }
  
    if ((name === "NumeroDocumento" || name === "Telefono" || name === "CodigoVivienda") && !/^\d*$/.test(value)) {
      errorMessage = "Este campo solo puede contener números.";
      isValid = false;
    }
  
    if (name === "Motivo" && !/^[\w\s.,!?]*$/.test(value)) {
      errorMessage = "El motivo solo puede contener letras, números y puntuación básica.";
      isValid = false;
    }
  
    if (name === "HoraInicio" || name === "HoraFin") {
      const horaValida = validarHora(value, name);
      if (!horaValida.isValid) {
        errorMessage = horaValida.message;
        isValid = false;
      }
    }
  
    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  
    if (isValid) {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  const validarHora = (hora, tipo) => {
    const [hours, minutes] = hora.split(':').map(Number);
    const horaInicio = 9; // 9:00 AM
    const horaFin = 23; // 11:00 PM 
  
    if (tipo === "HoraInicio") {
      if (hours < horaInicio || hours >= 24) {
        return { isValid: false, message: "La hora de inicio debe estar entre las 9:00 AM y las 11:59 PM." };
      }
    } else if (tipo === "HoraFin") {
      if ((hours < horaInicio && hours >= horaFin) || hours >= 24) {
        return { isValid: false, message: "La hora de fin debe estar entre las 9:00 AM y la 1:00 AM del día siguiente." };
      }
    }
    return { isValid: true, message: "" };
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isDateReserved(selectedDate)) {
      toast.error("Este día ya está reservado.");
      return;
    }
  
    const inicioValido = validarHora(formData.HoraInicio, "HoraInicio");
    const finValido = validarHora(formData.HoraFin, "HoraFin");
  
    if (!inicioValido.isValid || !finValido.isValid) {
      setFormErrors(prev => ({
        ...prev,
        HoraInicio: inicioValido.message,
        HoraFin: finValido.message
      }));
      return;
    }
  
    const [inicioHora, inicioMinutos] = formData.HoraInicio.split(':').map(Number);
    const [finHora, finMinutos] = formData.HoraFin.split(':').map(Number);
  
    // Si HoraFin cruza la medianoche, ajustamos para compararlo correctamente
    const inicioEnMinutos = inicioHora * 60 + inicioMinutos;
    const finEnMinutos = (finHora === 0 || finHora === 1 ? finHora + 23 : finHora) * 60 + finMinutos;
  
    if (finEnMinutos <= inicioEnMinutos) {
      toast.error("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/ReservaSalon', {
        ...formData,
        Fecha: selectedDate,
      });
  
      setReservas(prevReservas => [
        ...prevReservas,
        {
          ...response.data,
          Fecha: new Date(response.data.Fecha).toISOString().split('T')[0]
        }
      ]);
  
      handleModalClose();
      toast.success("¡Reserva realizada con éxito!");
    } catch (error) {
      console.error('Error detallado:', error);
      toast.error(`Error al realizar la reserva: ${error.response?.data?.message || 'Por favor, intente de nuevo.'}`);
    }
  };
  
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const reserva = reservas.find(res => res.Fecha === dateStr);
      if (reserva) {
        const colorClass = reserva.NumeroDocumento === propietarioActual ? 'green' : 'red';
        return <div className={`indicator ${colorClass}`}></div>;
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      return date < today;
    }
    return false;
  };

  return (
    <div>
    <ToastContainer />
    <div>
      <h2 className="calendario-header">Reservar Salón Comunal</h2>
        
        <Calendar
          onChange={handleDateChange}
          tileContent={tileContent}
          tileDisabled={tileDisabled}
        />
      </div>
      <Modal
  show={showModal}
  onHide={handleModalClose}
  centered
  backdrop="static"
  keyboard={false}
  className="custom-modal"
  size="lg"
>
  <Modal.Header className="border-0 pb-0">
    <Button 
      variant="close" 
      onClick={handleModalClose} 
      className="close-button"
      style={{
        right: '1.5rem',  // Increased from 1rem to 1.5rem
        top: '0.5rem',
        fontSize: '0.60rem',
        opacity: 1,
        color: '#000',
        padding: '0.25rem 0.5rem',
        lineHeight: '1',
        fontWeight: 'bold',
      }}
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </Button>
  </Modal.Header>
  <Modal.Body className="pt-0">
    <h4 className="mb-4">Reserva del Salón para el {selectedDate}</h4>
    <Form onSubmit={handleFormSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="Nombre">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nombre"
                    placeholder="Ingrese su nombre"
                    value={formData.Nombre}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.Nombre && <div className="error-message">{formErrors.Nombre}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="NumeroDocumento">
                  <Form.Label>Número de Documento</Form.Label>
                  <Form.Control
                    type="text"
                    name="NumeroDocumento"
                    placeholder="Ingrese su documento"
                    value={formData.NumeroDocumento}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.NumeroDocumento && <div className="error-message">{formErrors.NumeroDocumento}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="Telefono">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="Telefono"
                    placeholder="Ingrese su teléfono"
                    value={formData.Telefono}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.Telefono && <div className="error-message">{formErrors.Telefono}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="CodigoVivienda">
                  <Form.Label>Código de Vivienda</Form.Label>
                  <Form.Control
                    type="text"
                    name="CodigoVivienda"
                    placeholder="Ingrese su código de vivienda"
                    value={formData.CodigoVivienda}
                    onChange={handleChange}
                    required
                  />
                  {formErrors.CodigoVivienda && <div className="error-message">{formErrors.CodigoVivienda}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="HoraInicio">
                  <Form.Label>Hora de Inicio</Form.Label>
                  <Form.Control
                    type="time"
                    name="HoraInicio"
                    value={formData.HoraInicio}
                    onChange={handleChange}
                    required
                    min="09:00"
                    max="23:59"
                  />
                  {formErrors.HoraInicio && <div className="error-message">{formErrors.HoraInicio}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="HoraFin">
                  <Form.Label>Hora de Fin</Form.Label>
                  <Form.Control
                    type="time"
                    name="HoraFin"
                    value={formData.HoraFin}
                    onChange={handleChange}
                    required
                    min="09:00"
                    max="23:00"
                  />
                  {formErrors.HoraFin && <div className="error-message">{formErrors.HoraFin}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="Motivo">
              <Form.Label>Motivo de la Reserva</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Motivo"
                placeholder="Escriba el motivo de la reserva (máx. 200 caracteres)"
                value={formData.Motivo}
                onChange={handleChange}
                required
                maxLength={200}
              />
              {formErrors.Motivo && <div className="error-message">{formErrors.Motivo}</div>}
              <div className="text-end mt-1">
                {formData.Motivo.length} / 200
              </div>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Confirmar Reserva
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Calendario;