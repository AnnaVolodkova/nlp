import React from 'react';

import ModalWindow from '../modal';

import styles from './my-modal.pcss';

export default function MyModal(props) {
  return (
    <ModalWindow
      title="Title"
      description="description"
      isOpen
      onRequestClose={props.onClose}
      className={styles.modal}
    >
      <div>Hahahah</div>
    </ModalWindow>
  );
}

