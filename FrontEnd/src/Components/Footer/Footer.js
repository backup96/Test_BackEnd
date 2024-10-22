import React, { useState } from 'react';
import Modal from '../Componentes_Main/modal'; // Asumiendo que tienes un componente Modal

const Footer = () => {
  const [modalContent, setModalContent] = useState({ show: false, title: '', content: '' });

  const openModal = (title, content) => {
    setModalContent({ show: true, title, content });
  };

  const closeModal = () => {
    setModalContent({ show: false, title: '', content: '' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="footer-contact">
              <h3>Contacto</h3>
              <ul className="list-unstyled links">
                <li>Cl. 9 Sur #26-32, Bogotá</li>
                <li>
                  <a href="tel://11234567890">601 747 9393</a>
                </li>
                <li>
                  <a href="mailto:uralitasigloxxi@gmail.com">
                    uralitasigloxxi@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="footer-contact">
              <h3>Nosotros</h3>
              <ul className="list-unstyled float-start links">
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Acerca de",
                        "Torres de Santa Isabel es un moderno y acogedor conjunto residencial ubicado en una zona estratégica que ofrece tranquilidad y comodidad. Con una arquitectura contemporánea y bien pensada, el complejo cuenta con amplias áreas verdes, zonas recreativas y servicios de alta calidad para satisfacer las necesidades de sus residentes. Su diseño enfocado en la seguridad y el bienestar de la comunidad, junto con su proximidad a centros educativos, comerciales y de salud, lo convierte en un lugar ideal para vivir en familia o disfrutar de un entorno relajado y funcional."
                      )
                    }
                  >
                    Acerca de
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Servicios",
                        `Parqueadero:\n\nTorres de Santa Isabel ofrece un parqueadero amplio y seguro, diseñado para proteger los vehículos de los residentes. Este espacio proporciona tranquilidad y conveniencia, garantizando que cada propietario tenga acceso a un lugar adecuado y bien vigilado para estacionar su automóvil.\n\n
    Salón Comunal:\n\nEl conjunto residencial cuenta con un salón comunal versátil y acogedor, ideal para eventos y reuniones sociales. Este espacio compartido está equipado para facilitar actividades comunitarias y celebraciones, promoviendo la interacción entre vecinos y fortaleciendo el sentido de comunidad.\n\n
    Vivienda:\n\nLas viviendas en Torres de Santa Isabel están diseñadas con un enfoque en la funcionalidad y el confort. Cada unidad ofrece ambientes amplios y bien iluminados, que se adaptan a las necesidades de las familias, proporcionando un hogar cómodo y moderno en un entorno agradable y seguro.`
                      )
                    }
                  >
                    Servicios
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Mision",
                        "En Torres de Santa Isabel, nuestra misión es ofrecer un entorno residencial de alta calidad que combine comodidad, seguridad y comunidad. Nos comprometemos a proporcionar espacios funcionales y bien diseñados, junto con servicios excepcionales como parqueadero seguro, salón comunal para actividades sociales y viviendas confortables, para mejorar la calidad de vida de nuestros residentes y fomentar un ambiente de convivencia armónica."
                      )
                    }
                  >
                    Visión
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Vision",
                        "Ser el conjunto residencial líder en la región, reconocido por su excelencia en servicios, innovación en diseño y compromiso con la satisfacción de nuestros residentes. Aspiramos a crear un entorno en el que cada hogar y cada espacio común contribuyan al bienestar general, promoviendo una comunidad vibrante y cohesionada que valore la tranquilidad, la seguridad y el sentido de pertenencia."
                      )
                    }
                  >
                    Misión
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Términos",
                        "En Torres de Santa Isabel, los residentes deben cumplir con los términos y condiciones establecidos para garantizar un entorno armonioso y seguro. Las normativas incluyen el respeto a las áreas comunes, la correcta utilización del parqueadero asignado y el cumplimiento de horarios para eventos en el salón comunal. Se prohíbe realizar modificaciones sin autorización y se exige mantener las viviendas en buen estado. Cualquier incumplimiento de estas directrices puede conllevar sanciones, buscando siempre preservar la calidad de vida y el bienestar de la comunidad."
                      )
                    }
                  >
                    Términos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={() =>
                      openModal(
                        "Seguridad",
                        "En Torres de Santa Isabel, la seguridad de nuestros residentes es una prioridad fundamental. El conjunto residencial está equipado con sistemas de vigilancia modernos y control de acceso riguroso, asegurando un entorno protegido y confiable. Además, contamos con iluminación adecuada en todas las áreas comunes y un parqueadero vigilado, lo que refuerza nuestro compromiso de ofrecer un hogar seguro y tranquilo para todos nuestros habitantes"
                      )
                    }
                  >
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-map">
          <h3>Ubicación</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d812.2533295607444!2d-74.10167660768079!3d4.594403492552016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9922663ddfeb%3A0x74ba17e59abad638!2sConjunto%20Residencial%20Torres%20De%20Santa%20Isabel!5e0!3m2!1sen!2sco!4v1729550491659!5m2!1sen!2sco"
            width="600"
            height="600"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <Modal
          show={modalContent.show}
          handleClose={closeModal}
          title={modalContent.title}
          content={modalContent.content}
        />
      </div>
    </footer>
  );
};

export default Footer;