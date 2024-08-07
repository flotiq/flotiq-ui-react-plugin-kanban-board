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
  const AdditionalDataRenderer = useCallback(({ type, data }) => {
    const defaultRenderer = (data) => {};

    const checkBoxRenderer = (data) => {};

    const selectAndRadioRenderer = (data) => {};

    switch (type) {
      case 'checkbox':
        return checkBoxRenderer(data);
      case 'select':
      case 'radio':
        return selectAndRadioRenderer(data);
      case 'text':
      case 'number':
      case 'date':
        return defaultRenderer(data);
      default:
        return defaultRenderer(data);
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
          <AdditionalDataRenderer type={''} data={''} />
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;
