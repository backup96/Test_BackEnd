import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import './Calendario.css';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Calendario = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [userDocumento, setUserDocumento] = useState('');
  const [formData, setFormData] = useState({
    numDocumento: '',
    horarioInicio: '',
    horarioFin: '',
    motivoReunion: '',
    Fecha: ''
  });
  const [reservas, setReservas] = useState([]);
  const [currentUserDoc, setCurrentUserDoc] = useState('');
  const [formErrors, setFormErrors] = useState({
    motivoReunion: ''
  });
  const [charCount, setCharCount] = useState({
    motivoReunion: 0
  });

  const toastId = React.useRef(null);

  useEffect(() => {
    setCurrentUserDoc(formData.numDocumento);
  }, [formData.numDocumento]);

  useEffect(() => {
    axios.get(`http://localhost:8081/citas_salon_comunal?numDocumento=${currentUserDoc}`)
      .then((res) => {
        if (res.status === 200) {
          setReservas(res.data);
        }
      })
      .catch((err) => console.log(err));
  }, [currentUserDoc]);

  const isDateReserved = (date) => reservas.some(res => res.Fecha === date);

  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    if (isDateReserved(formattedDate)) {
      toast.error("Este día ya está reservado.");
      return;
    }
    
    setSelectedDate(formattedDate);
    setFormData(prevState => ({
      ...prevState,
      Fecha: formattedDate,
    }));
    
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let isValid = true;
    let errorMessage = '';

    if (name === "motivoReunion") {
      if (!/^[\w\s.,!?ñÑ]*$/.test(value)) {
        errorMessage = "El motivo solo puede contener letras (incluyendo ñ), números y puntuación básica.";
        isValid = false;
      } else if (value.length > 200) {
        errorMessage = "El motivo de la reunión no puede exceder los 200 caracteres.";
        isValid = false;
      }
      setCharCount(prev => ({ ...prev, motivoReunion: value.length }));
    }

    // Validación para numDocumento
    if (name === "numDocumento") {
      // Validar solo números y longitud máxima de 15 caracteres
      if (!/^\d*$/.test(value)) { // Permitir solo números
        errorMessage = "El número de documento solo puede contener números.";
        isValid = false;
      } else if (value.length > 15) {
        errorMessage = "El número de documento no puede exceder los 15 dígitos.";
        isValid = false;
      }
    }
    if (name === "horarioInicio" || name === "horarioFin") {
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
      if (name === 'numDocumento') {
        setUserDocumento(value);
      }
    }
  };

  const validarHora = (hora, tipo) => {
    if (!hora) {
      return { isValid: false, message: "Por favor, ingrese una hora válida." };
    }

    const [hours, minutes] = hora.split(':').map(Number);
    const horaInicio = 9;
    const horaFin = 23;

    if (tipo === "horarioInicio") {
      if (hours < horaInicio || hours >= 24) {
        return { isValid: false, message: "La hora de inicio debe estar entre las 9:00 AM y las 11:59 PM." };
      }
    } else if (tipo === "horarioFin") {
      if ((hours < horaInicio && hours >= horaFin) || hours >= 24) {
        return { isValid: false, message: "La hora de fin debe estar entre las 9:00 AM y la 1:00 AM del día siguiente." };
      }
    }

    return { isValid: true, message: "" };
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (isDateReserved(selectedDate)) {
      return;
    }

    axios.post('http://localhost:8081/citas_salon_comunal', formData)
    .then((response) => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("¡Reserva realizada con éxito!");
        
        // Actualizar el documento del usuario cuando hace una reserva exitosa
        setUserDocumento(formData.numDocumento);

        handleModalClose();
        setReservas(prevReservas => [
          ...prevReservas,
          {
            ...response.data,
            Fecha: selectedDate,
            numDocumento: formData.numDocumento // Asegurarse de incluir el número de documento
          }
        ]);
      } else {
        toast.error("Hubo un problema al registrar la cita");
      }
    })
    .catch((error) => {
      toast.error(`Error al realizar la reserva: ${error.response?.data?.message || 'Por favor, intente de nuevo.'}`);
    });
  };
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const reservaParaFecha = reservas.find(res => res.Fecha === dateStr);

      if (reservaParaFecha) {
        // Comparar con el documento del usuario actual
        const esReservaPropia = String(reservaParaFecha.numDocumento) === String(userDocumento);
        
        return (
          <div className="tile-content">
            <div 
              className="indicator" 
              style={{ 
                backgroundColor: esReservaPropia ? '#4CAF50' : '#FF5252',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                margin: '0 auto',
                marginTop: '2px'
              }}
              title={esReservaPropia ? 'Tu reserva' : 'Reservado por otro propietario'}
            />
            <div className="reservation-time" style={{ fontSize: '8px', marginTop: '2px' }}>
              {reservaParaFecha.horarioInicio}
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <div>
      <h2 className="calendario-header">Reservar Salón Comunal</h2>
      <Calendar
        onChange={handleDateChange}
        tileDisabled={({ date }) => date < new Date()}
        tileContent={tileContent}
      />
      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Reserva para el {selectedDate}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="numDocumento">
                  <Form.Label>Numero Documento</Form.Label>
                  <Form.Control
                    type="number"
                    name="numDocumento"
                    placeholder="Ingrese su documento"
                    value={formData.numDocumento}
                    onChange={handleChange}
                    isInvalid={!!formErrors.numDocumento}
                    maxLength={15}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.numDocumento}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <br />

            <Row>
              <Col md={6}>
                <Form.Group controlId="HorarioInicio">
                  <Form.Label>Hora de Inicio</Form.Label>
                  <Form.Control
                    type="time"
                    name="horarioInicio"
                    value={formData.horarioInicio}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="HorarioFin">
                  <Form.Label>Hora de Fin</Form.Label>
                  <Form.Control
                    type="time"
                    name="horarioFin"
                    value={formData.horarioFin}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <br />

            <Form.Group controlId="MotivoReunion">
              <Form.Label>Motivo de la Reserva</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="motivoReunion"
                value={formData.motivoReunion}
                onChange={handleChange}
                isInvalid={!!formErrors.motivoReunion}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.motivoReunion}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                {charCount.motivoReunion}/200 caracteres
              </Form.Text>
            </Form.Group>

            <Button variant="primary" type="submit">
              Reservar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Calendario;
