import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';

const ConstructorFilling = ({ item, index, moveCard, onRemove }) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'constructor-filling',
    collect: (monitor) => ({
      handlerId: monitor.getHandlerId(),
    }),
    hover(dragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = dragItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      dragItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'constructor-filling',
    item: () => ({ uuid: item.uuid, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`${styles.item} pb-4`}
      data-handler-id={handlerId}
      style={{
        opacity: isDragging ? 0.3 : 1,
      }}
    >
      <div className={styles.dragIcon}>
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
        handleClose={() => onRemove(item.uuid, item._id)}
      />
    </li>
  );
};

ConstructorFilling.propTypes = {
  item: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  moveCard: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default ConstructorFilling;

