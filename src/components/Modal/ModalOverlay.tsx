import React from 'react';
import styles from './Modal.module.css';

interface ModalOverlayProps {
  onClose: () => void;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ onClose }) => {
  return <div className={styles.overlay} onClick={onClose} />;
};

export default ModalOverlay;
