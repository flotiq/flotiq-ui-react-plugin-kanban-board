import { useCallback, useMemo, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const KanbanCard = ({
  card,
  contentObject,
  getApiUrl,
  additionalClasses = '',
}) => {
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
        break;
      case 'text':
      case 'number':
      case 'date':
        return defaultRenderer(data);
        break;
    }
  }, []);

  const cardImage = useMemo(() => {
    const src = card.image?.[0]?.dataUrl;
    if (!src) return null;
    console.log(getApiUrl() + src);

    return getApiUrl() + src;
  }, [card]);

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
        {cardImage && (
          <img className="kanban-board__card-image" alt="" src={cardImage} />
        )}
      </div>
      <h5 className="kanban-board__card-header">{card.title}</h5>
      <div className="kanban-board__card-addtional-fields-container">
        {card.additional_field.map((additionalField) => (
          <AdditionalDataRenderer type={''} data={''} />
        ))}
      </div>
    </div>
  );
};

export default KanbanCard;
