import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const AdditionalDataRenderer = ({ data, dataKey, type }) => {
  const defaultRenderer = (dataKey, data) => (
    <div className="kanban-board__card-additional-field-default-renderer">
      <span className="kanban-board__card-additional-field-default-renderer-title">
        {dataKey}:
      </span>
      <span className="kanban-board__card-additional-field-default-renderer-value">
        {data}
      </span>
    </div>
  );

  const checkBoxRenderer = (dataKey, data) => (
    <div className="kanban-board__card-additional-field-checkbox-renderer">
      <span className="kanban-board__card-additional-field-checkbox-renderer-title">
        {dataKey}:
      </span>
      <input type={'checkbox'} checked={data === true} readOnly />
    </div>
  );

  const selectAndRadioRenderer = (dataKey, data) => (
    <div className="kanban-board__card-additional-field-select-radio-renderer">
      <span className="kanban-board__card-additional-field-select-radio-renderer-title">
        {dataKey}:
      </span>
      <span className="kanban-board__card-additional-field-select-radio-renderer-value">
        {data}
      </span>
    </div>
  );

  switch (type) {
    case 'checkbox':
      return checkBoxRenderer(dataKey, data);
    case 'select':
    case 'radio':
      return selectAndRadioRenderer(dataKey, data);
    case 'text':
    case 'number':
    case 'date':
      return defaultRenderer(dataKey, data);
    default:
      return <></>;
  }
};

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
      className={
        `kanban-board__card-container ${card.image && 'kanban-board__card-with_image'}` +
        additionalClasses
      }
    >
      {card.image && (
        <div className="kanban-board__card-image-container">
          <img
            className="kanban-board__card-image"
            alt=""
            src={card.image}
            width={200}
            height={150}
          />
        </div>
      )}
      <h5 className="kanban-board__card-header">{card.title}</h5>
      <div className="kanban-board__card-additional-fields-container">
        {card.additionalFields.map((additionalField) => (
          <AdditionalDataRenderer
            key={additionalField.key}
            dataKey={additionalField.key}
            data={additionalField.data}
            type={additionalField.type}
          />
        ))}
      </div>

      {console.log('contentObject', window, contentObject)}
      <div className="kanban-board__card-actions">
        <div className="actions-footer">
          <a
            className="action-button icon-edit"
            href={
              window.location.pathname.replace(
                contentObject.internal.contentType,
                '',
              ) +
              `edit/` +
              contentObject.internal.contentType +
              '/' +
              contentObject.id
            }
            target="_self"
            rel="noreferrer"
            title="Edit"
          />
          <a
            className="action-button icon-duplicate"
            href={
              window.location.pathname.replace(
                contentObject.internal.contentType,
                '',
              ) +
              `duplicate/` +
              contentObject.internal.contentType +
              '/' +
              contentObject.id
            }
            target="_self"
            rel="noreferrer"
            title="Duplicate"
          />
          <span className="action-button icon-delete" title="Delete" />
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
