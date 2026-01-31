import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import { ConstructorIngredient } from '../../utils/types';

interface ConstructorFillingProps {
  item: ConstructorIngredient;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
  onRemove: (uuid: string, ingredientId: string) => void;
}

interface DragItem {
  uuid: string;
  index: number;
}

const ConstructorFilling: React.FC<ConstructorFillingProps> = ({ item, index, moveCard, onRemove }) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
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
      if (!clientOffset) return;
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

  const [{ isDragging }, drag] = useDrag<DragItem, void, { isDragging: boolean }>({
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
      data-testid="constructor-filling"
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

export default ConstructorFilling;
