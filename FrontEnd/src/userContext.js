import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Pages/auth/portero/InvitadoDetalle.css";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [countdown, setCountdown] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevTimers) =>
        prevTimers
          .filter((timer) => !(timer.countdown === 0 && timer.isRunning))
          .map((timer) => {
            if (timer.isRunning && !timer.isPaused && timer.countdown > 0) {
              return { ...timer, countdown: timer.countdown - 1 };
            }
            return timer;
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleStartCountdown = (invitado) => {
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    if (timeInSeconds > 0) {
      const result = countdown.find(
        (timer) => timer.invitado === invitado && timer.countdown !== 0
      );
      if (result) {
        setCountdown((prevTimers) =>
          prevTimers.filter((timer) => !(timer.invitado === invitado))
        );
        const newTimer = {
          invitado,
          countdown: result.countdown,
          isRunning: true,
          isPaused: false,
        };

        setCountdown((prevTimers) => [...prevTimers, newTimer]);
      } else {
        const newTimer = {
          invitado,
          countdown: timeInSeconds,
          isRunning: true,
          isPaused: false,
        };
        setCountdown((prevTimers) =>
          prevTimers.filter((timer) => !(timer.countdown === 0))
        );

        setCountdown((prevTimers) => [...prevTimers, newTimer]);
      }
    }
    console.log(countdown);
  };

  const handlePauseCountdown = (invitado) => {
    setCountdown((prevTimers) =>
      prevTimers.map((timer) =>
        timer.invitado === invitado
          ? { ...timer, isPaused: !timer.isPaused }
          : timer
      )
    );
  };

  const handleStopCountdown = (invitado) => {
    setCountdown((prevTimers) =>
      prevTimers.map((timer) =>
        timer.invitado === invitado
          ? { ...timer, countdown: 0, isRunning: false, isPaused: false }
          : timer
      )
    );
  };

  const handleResetCountdown = (invitado) => {
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    setCountdown((prevTimers) =>
      prevTimers.map((timer) =>
        timer.invitado === invitado
          ? {
              ...timer,
              countdown: timeInSeconds,
              isPaused: false,
              isRunning: false,
            }
          : timer
      )
    );
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user) {
          const response = await axios.get(
            `http://localhost:4000/Propietarios/${user.id}`
          ); // Actualiza con el ID correcto
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        hours,
        setHours,
        minutes,
        setMinutes,
        seconds,
        setSeconds,
        handleStartCountdown,
        handlePauseCountdown,
        handleStopCountdown,
        handleResetCountdown,
        formatTime,
        countdown,
        setCountdown,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
