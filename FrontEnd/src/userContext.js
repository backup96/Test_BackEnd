import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "./Pages/auth/portero/InvitadoDetalle.css";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [records, setRecords] = useState([]);
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
              if (timer.countdown <= 600 && timer.sendAlt === 0) {
                axios
                  .post(`/portero/sendInformacion`, {
                    Correo: timer.email,
                    Placa: timer.placa,
                    Esp: timer.parq,
                  })
                  .then((res) => {
                    console.log(res.status);
                    if (res.data.Status === "Success") {
                      console.log("Que bien");
                    }
                  })
                  .catch((err) => {
                    console.log(err.response.data.Error);
                    if (err.response.data.Error === "ER_ROW_IS_REFERENCED_2") {
                      console.log("Que mal");
                    }
                  });
                return { ...timer, countdown: timer.countdown - 1, sendAlt: 1 };
              }
              if (timer.countdown === 1) {
                return {
                  ...timer,
                  countdown: timer.countdown + 600,
                  sendAlt: 0,
                  acum: timer.acum + 1,
                };
              }
              return { ...timer, countdown: timer.countdown - 1 };
            }
            return timer;
          })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleStartCountdown = (invitado, email, placa, esp) => {
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
          email: email,
          placa: placa,
          parq: esp,
          acum: 0,
          initTime: timeInSeconds,
          countdown: result.countdown,
          isRunning: true,
          isPaused: false,
          sendAlt: result.sendAlt,
        };

        setCountdown((prevTimers) => [...prevTimers, newTimer]);
      } else {
        const newTimer = {
          invitado,
          email: email,
          placa: placa,
          parq: esp,
          acum: 0,
          initTime: timeInSeconds,
          countdown: timeInSeconds,
          isRunning: true,
          isPaused: false,
          sendAlt: 0,
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
          ? (totalPay(
              timer.initTime,
              timer.acum,
              timer.countdown,
              timer.email,
              timer.placa,
              timer.parq
            ),
            {
              ...timer,
              countdown: 0,
              acum: 0,
              isRunning: false,
              isPaused: false,
              sendAlt: 0,
            })
          : timer
      )
    );
  };

  const totalPay = (initTime, acum, countdown, email, placa, parq) => {
    var total;
    total = initTime + (acum * 600 - countdown);
     axios
       .post(`/portero/sendTicket`, {
         Correo: email,
         Placa: placa,
         Esp: parq,
         Total: total,
         Time: formatTime(total)
       })
       .then((res) => {
         console.log(res.status);
         if (res.data.Status === "Success") {
           console.log("Que bien");
         }
       })
       .catch((err) => {
         console.log(err.response.data.Error);
         if (err.response.data.Error === "ER_ROW_IS_REFERENCED_2") {
           console.log("Que mal");
         }
       });
  };

  const handleResetCountdown = (invitado) => {
    const timeInSeconds = hours * 3600 + minutes * 60 + seconds;
    setCountdown((prevTimers) =>
      prevTimers.map((timer) =>
        timer.invitado === invitado
          ? {
              ...timer,
              countdown: timeInSeconds,
              acum: 0,
              initTime: timeInSeconds,
              isPaused: false,
              isRunning: false,
              sendAlt: 0,
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

  return (
    <UserContext.Provider
      value={{
        records,
        setRecords,
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
