import React from 'react';
import Modal from 'react-modal';

import './modal.css';

export default function ModalWindow(props) {
  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onRequestClose}
      // style="modal"
      ariaHideApp
      shouldFocusAfterRender
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
      // overlayClassName={styles.overlay}
      className="modal"
      // style={{width: '200px'}}
    >
      <h1>{props.title}</h1>
      <p>{props.description}</p>
      {props.children}
    </Modal>
  );
}

Modal.setAppElement('#root');
