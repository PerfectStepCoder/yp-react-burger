import React, { useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from './ModalOverlay';
import styles from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Сохраняем текущее значение overflow для восстановления
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Вычисляем ширину скроллбара, чтобы избежать сдвига контента
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // Блокируем скролл, но сохраняем padding для компенсации скроллбара
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Восстанавливаем оригинальные значения
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
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

export default Modal;
