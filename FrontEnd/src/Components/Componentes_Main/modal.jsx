import React from 'react';

const Modal = ({ show, handleClose, title, content }) => {
  return (
    <div className={`modal ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>{title}</h2>
        <p>{content}</p>
      </div>
      <div className="modal-backdrop" style={{ display: show ? 'block' : 'none' }} onClick={handleClose}></div>
    </div>
  );
};

export default Modal;
