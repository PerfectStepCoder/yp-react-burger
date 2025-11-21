import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from './ModalOverlay';
import styles from './Modal.module.css';

const Modal = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const modalContent = (
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className="text text_type_main-large">{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Закрыть"
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </>
  );

  return createPortal(modalContent, document.getElementById('react-modals') || document.body);
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;

