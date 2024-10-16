import React, { useState } from 'react';
import { Link } from "react-router-dom";
import myImg from "../../img/logo2.png"; /* Importación logo del conjunto */
import Fondo1 from "../../img/fondo1.png"; /* Importación de la imagen de fondo */
import Perfil from "../../img/Usuario.png"
import "../../styles/main.css";
import Footer from '../../Components/Footer/Footer';
/* Creación del componente Main */
const Main = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [Fondo1]; // Imagenes para el carrusel

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  
  return (
    <div className="home">
      <header className="header">
        <div className="header-logo">
          <img src={myImg} alt="Logo del conjunto residencial" className="logo-img" />
          <h1>Conjunto Torres de Santa Isabel</h1>
        </div>
      </header>

      <div
        className="welcome-background"
        style={{
          backgroundImage: `url(${Fondo1})`, // Imagen de fondo importada
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '70vh', // Ajustar a la altura completa de la ventana
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'brightness(90%)' // Oscurecer la imagen de fondo
        }}
      >
        <div
          className="welcome-content"
          style={{
            textAlign: 'center',
            color: '#fff',
            padding: '20px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro semi-transparente
            borderRadius: '10px'
          }}
        >
          <h2>Bienvenid@</h2>
          <p>Antes de ingresar desea ingresar como:</p>
          <div
            className="welcome-buttons"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15px'
            }}
          >
            <Link to="/LoginPropietario" className="btn btn-owner" style={{ backgroundColor: '#28a745', color: '#fff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>Propietario</Link>
            <Link to="/LoginAdministrador" className="btn btn-admin" style={{ backgroundColor: '#dc3545', color: '#fff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>Administrador</Link>
            <Link to="/LoginPortero" className="btn btn-porter" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>Portero</Link>
          </div>
        </div>
      </div>

      <div className="welcome-section">
        <div className="welcome-text">
          <h2>Conjunto Residencial Torres de Santa Isabel</h2>
          <p>
            Te damos la bienvenida a nuestra plataforma diseñada para facilitar tu trabajo. Aquí encontrarás herramientas para gestionar eficientemente las operaciones diarias y garantizar la comodidad de los residentes. Explora nuestras funcionalidades y contáctanos si necesitas ayuda. ¡Gracias por ser parte de nuestro equipo!
          </p>
          <a href="https://maps.app.goo.gl/3cEXQRnnLgatSydR8" className="contact-btn" target="_blank" rel="noopener noreferrer">Contáctanos</a>
        </div>
        <div className="welcome-collage">
          <img src={myImg} alt="Imagen de bienvenida" className="collage-img" />
        </div>
      </div>

      {/* Carrusel antes del card */}
      <div className="carousel-container">
        <button className="carousel-control prev" onClick={prevSlide}>
          &#10094;
        </button>
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} className="carousel-image" />
        <button className="carousel-control next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>

      <div className="cards-container">
        <div className="card-perfil">
          <img src={Perfil} alt="Foto de la Cara" />
          <h1>Mario Alfonso Guerra</h1>
          <p>Cargo: Administrador</p>
          <h2>Hola, soy el administrador de este conjunto residencial y los quiero invitar a comprartir con nosotros</h2>
        </div>
        <div className="card-perfil">
          <img src={Perfil} alt="Foto de la Cara" />
          <h1>Ana María Araque</h1>
          <p>Cargo: Secretaria</p>
          <h2>Estoy aquí para ayudarte con cualquier duda o inquietud que tengas</h2>
        </div>
        <div className="card-perfil">
          <img src={Perfil} alt="Foto de la Cara" />
          <h1>Julian Andrés López</h1>
          <p>Cargo: Coordinador de eventos</p>
          <h2>Conmigo podras organizar diferentes eventos privados y publicos haciendo uso de nuestras instalaciones</h2>
          <p>Telefono: 3138345761</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
