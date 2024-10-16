import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./InvitadoDetalle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStop,
  faRedo,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../../userContext";
import { useTable } from "../../../Components/Componentes_Portero/navBar";

const InvitadoDetalle = ({ id }) => {
  const navigate = useNavigate(); // Hook para navegar
  const [guest, setGuest] = useState("");

  const {
    hours,
    setHours: setContextHours,
    minutes,
    setMinutes: setContextMinutes,
    seconds,
    setSeconds: setContextSeconds,
    handleStartCountdown,
    handlePauseCountdown,
    handleStopCountdown,
    handleResetCountdown,
    formatTime,
    countdown,
  } = useUser();

  const { invitado } = useTable();

  useEffect(() => {
    const fetchGuestDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/Invitados/${invitado}`
        );
        setGuest(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles del invitado:", error);
      }
    };

    fetchGuestDetails();
  }, [invitado]);


  if (!invitado) {
    return <div className="loading">Cargando detalles del invitado...</div>;
  }

  const verdata = countdown.find(
        (timer) => timer.invitado === invitado);

  return (
    <>
      <div className="container">
        <div className="details-container">
          <div className="headerr">
            <h2>Detalles del Invitado</h2>
          </div>
          <div className="countdown-section">
            <h3>Cuenta Regresiva</h3>
            <div className="input-group-container">
              <div className="input-group">
                <label htmlFor="hours">Horas</label>
                <input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={(e) =>
                    setContextHours(parseInt(e.target.value, 10))
                  }
                  className="time-input"
                  placeholder="Horas"
                />
              </div>
              <div className="input-group">
                <label htmlFor="minutes">Minutos</label>
                <input
                  id="minutes"
                  type="number"
                  value={minutes}
                  onChange={(e) =>
                    setContextMinutes(parseInt(e.target.value, 10))
                  }
                  className="time-input"
                  placeholder="Minutos"
                />
              </div>
              <div className="input-group">
                <label htmlFor="seconds">Segundos</label>
                <input
                  id="seconds"
                  type="number"
                  value={seconds}
                  onChange={(e) =>
                    setContextSeconds(parseInt(e.target.value, 10))
                  }
                  className="time-input"
                  placeholder="Segundos"
                />
              </div>
            </div>
            <div className="countdown-display">
              <h4>Tiempo Restante:</h4>
              <p className="countdown-time">
                {countdown.length === 0 || !verdata ? (
                  <>00:00:00</>
                ) : (
                  countdown
                    .filter((timer) => !(timer.invitado !== invitado))
                    .map((timer) =>
                      timer.invitado === invitado ? (
                        formatTime(timer.countdown)
                      ) : timer.invitado !== invitado ? (
                        <>00:00:00</>
                      ) : null
                    )
                )}
              </p>
            </div>
            <div className="countdown-controls">
              {countdown.length === 0 || !verdata ? (
                <>
                  <FontAwesomeIcon
                    icon={faRedo}
                    className="control-icon reset-icon"
                    onClick={() => {
                      handleResetCountdown(invitado);
                    }}
                    title="Reiniciar"
                  />
                  <FontAwesomeIcon
                    icon={faPlay}
                    className={`control-icon start-icon`}
                    onClick={() => handleStartCountdown(invitado)}
                    title="Iniciar"
                  />
                  <FontAwesomeIcon
                    icon={faStop}
                    className="control-icon stop-icon"
                    onClick={() => handleStopCountdown(invitado)}
                    title="Detener"
                  />
                </>
              ) : (
                countdown
                  .filter((timer) => !(timer.invitado !== invitado))
                  .map((timer) => (
                    <>
                      <FontAwesomeIcon
                        icon={faRedo}
                        className="control-icon reset-icon"
                        onClick={() => {
                          handleResetCountdown(invitado);
                        }}
                        title="Reiniciar"
                      />
                      {timer.isPaused && timer.isRunning === false ? (
                        <>
                          <FontAwesomeIcon
                            icon={faPlay}
                            className={`control-icon start-icon`}
                            onClick={() => handleStartCountdown(invitado)}
                            title="Iniciar"
                          />
                        </>
                      ) : timer.isRunning && timer.isPaused === false ? (
                        <>
                          <FontAwesomeIcon
                            icon={faPause}
                            className={`control-icon pause-icon`}
                            onClick={() => handlePauseCountdown(invitado)}
                            title={timer.isPaused ? "Reanudar" : "Pausar"}
                          />
                        </>
                      ) : timer.isPaused && timer.isRunning ? (
                        <>
                          <FontAwesomeIcon
                            icon={faPlay}
                            className={`control-icon start-icon`}
                            onClick={() => handleStartCountdown(invitado)}
                            title="Iniciar"
                          />
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon
                            icon={faPlay}
                            className={`control-icon start-icon`}
                            onClick={() => handleStartCountdown(invitado)}
                            title="Iniciar"
                          />
                        </>
                      )}
                      {console.log(timer.isPaused)}
                      {console.log(timer.isRunning)}
                      <FontAwesomeIcon
                        icon={faStop}
                        className="control-icon stop-icon"
                        onClick={() => handleStopCountdown(invitado)}
                        title="Detener"
                      />
                    </>
                  ))
              )}
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{guest.Nombre}</h5>
              <p className="card-text">
                <strong>Documento:</strong> {guest.NumeroDocumento}
              </p>
              <p className="card-text">
                <strong>Teléfono:</strong> {guest.Teléfono}
              </p>
              <p className="card-text">
                <strong>Correo:</strong> {guest.Correo}
              </p>
              <p className="card-text">
                <strong>Parqueadero Asignado:</strong> {guest.NumeroParqueadero}
              </p>
              <p className="card-text">
                <strong>Costo:</strong> {guest.Costo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitadoDetalle;
