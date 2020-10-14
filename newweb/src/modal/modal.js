import React from 'react';
import Modal from 'react-modal';

import './modal.css';

export default function ModalWindow(props) {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      ariaHideApp
      shouldFocusAfterRender
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      className={props.className}
    >
      <h3>{props.title}</h3>
      {props.children}
    </Modal>
  );
}

Modal.setAppElement('#root');
