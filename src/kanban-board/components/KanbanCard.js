import { useCallback } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanCard = ({ card, contentObject, additionalClasses = '' }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: contentObject.id,
    data: {
      type: 'Card',
      card,
      contentObject,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  //@todo add renderers
  const AdditionalDataRenderer = useCallback(({ data, key, type }) => {
    const defaultRenderer = (key, data) => {};

    const checkBoxRenderer = (key, data) => {};

    const selectAndRadioRenderer = (key, data) => {};

    switch (type) {
      case 'checkbox':
        return checkBoxRenderer(key, data);
      case 'select':
      case 'radio':
        return selectAndRadioRenderer(key, data);
      case 'text':
      case 'number':
      case 'date':
        return defaultRenderer(key, data);
      default:
        return <></>;
    }
  }, []);

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="kanban-board__card-container--place-holder"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={'kanban-board__card-container ' + additionalClasses}
    >
      <div className="kanban-board__card-image-container">
        {card.image && (
          <img
            className="kanban-board__card-image"
            alt=""
            src={card.image}
            width={200}
            height={150}
          />
        )}
      </div>
      <h5 className="kanban-board__card-header">{card.title}</h5>
      <div className="kanban-board__card-addtional-fields-container">
        {card.additionalFields.map((additionalField) => (
          <AdditionalDataRenderer {...additionalField} />
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;
