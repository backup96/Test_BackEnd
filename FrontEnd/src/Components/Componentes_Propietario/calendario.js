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
    motivoReunion: 0,
    telefono: 0,
    codigoVivienda: 0
  });

  const toastId = React.useRef(null);

  useEffect(() => {
    // Actualiza currentUserDoc cuando cambie el número de documento en el formulario
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
      if (!/^[\w\s.,!?ñÑ]*$/.test(value)) {  // Agregamos ñÑ aquí
        errorMessage = "El motivo solo puede contener letras (incluyendo ñ), números y puntuación básica.";
        isValid = false;
      } else if (value.length > 200) {
        errorMessage = "El motivo de la reunión no puede exceder los 200 caracteres.";
        isValid = false;
      }
      // Actualiza el conteo de caracteres
      setCharCount(prev => ({ ...prev, motivoReunion: value.length }));
    }
    
    if (name === "numDocumento") {
      if (!/^\d{8,}$/.test(value)) {
        errorMessage = "El número de documento debe tener al menos 8 dígitos.";
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
    }
  };
  const validarHora = (hora, tipo) => {
    if (!hora) {
      return { isValid: false, message: "Por favor, ingrese una hora válida." };
    }
  
    const [hours, minutes] = hora.split(':').map(Number);
    const horaInicio = 9; // 9:00 AM
    const horaFin = 23;   // 11:00 PM
  
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
      console.log("Este día ya está reservado.");
      return;
    }
    
    axios.post('http://localhost:8081/citas_salon_comunal', formData)
    .then((response) => {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.success("¡Reserva realizada con éxito!");

        handleModalClose();
        setReservas(prevReservas => [
          ...prevReservas,
          {
            ...response.data,
            Fecha: selectedDate
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
    const reserva = reservas.find(res => res.Fecha === dateStr);
    
    if (reserva) {
      // Asegúrate de que currentUserDoc esté definido y sea el mismo tipo de dato que reserva.numDocumento
      const isCurrentUserReservation = String(reserva.numDocumento) === String(currentUserDoc);
      return (
        <div 
          className="indicator" 
          style={{ 
            backgroundColor: isCurrentUserReservation ? 'green' : 'red',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            margin: '0 auto'
          }}
        />
      );
    }
  }
  return null;
};

  // const tileContent = ({ date, view }) => {
  //   if (view === 'month') {
  //     const dateStr = date.toISOString().split('T')[0];
  //     const reserva = reservas.find(res => res.Fecha === dateStr);
  //     if (reserva) {
  //       const colorClass = reserva.numDocumento === propietario ? 'green' : 'red';
  //       return <div className={`indicator ${colorClass}`}></div>;
  //     }
  //   }
  //   return null;
  // };

  return (
    <div>
      <h2 className="calendario-header">Reservar Salón Comunal</h2>
      <Calendar
        onChange={handleDateChange}
        tileDisabled={({ date }) => date < new Date()}
        tileContent={tileContent} // Añade aquí la función tileContent
      />
      <Modal show={showModal} onHide={handleModalClose} centered size="lg"> {/* Tamaño grande del modal */}
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
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.numDocumento}
                    </Form.Control.Feedback>
                  </Form.Group>
              </Col>
            </Row>
  <br></br>
            <Row>
  
          
            </Row>
            <br></br>
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
            <br></br>
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
                {charCount.motivoReunion} / 200 caracteres
              </Form.Text>
            </Form.Group>
  
            <Button type="submit" variant="primary" className="mt-3 float-end">
              Confirmar Reserva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
  
};

export default Calendario;
