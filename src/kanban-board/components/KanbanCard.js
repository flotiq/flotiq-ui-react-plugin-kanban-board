import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ReactComponent as IconEdit } from '../../images/pen-icon.svg';
import { ReactComponent as IconDuplicate } from '../../images/duplicate-icon.svg';
import { ReactComponent as IconDelete } from '../../images/bin-icon.svg';
import { ReactComponent as IconChecked } from '../../images/icon-checked.svg';
import { ReactComponent as IconUnchecked } from '../../images/icon-unchecked.svg';

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
      <span className="kanban-board__card-additional-field-checkbox-renderer-value">
        {data ? (
          <IconChecked alt="Checked icon" />
        ) : (
          <IconUnchecked alt="Unchecked icon" />
        )}
      </span>
    </div>
  );

  const selectAndRadioRenderer = (dataKey, data) => (
    <div className="kanban-board__card-additional-field-select-radio-renderer">
      <span className="kanban-board__card-additional-field-select-radio-renderer-title">
        {dataKey}:
      </span>
      <span className="kanban-board__card-additional-field-select-radio-renderer-value">
        {data ? data : '-'}
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

const KanbanCard = ({
  card,
  contentObject,
  deleteCard,
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
    transform: CSS.Translate.toString(transform && { ...transform }),
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
        `kanban-board__card-container ${card.image && 'kanban-board__card-with_image'} ` +
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
        {card.additionalFields
          ?.filter(({ data }) => data !== undefined)
          ?.map((additionalField, index) => {
            return (
              <AdditionalDataRenderer
                key={`${additionalField.key}-${index}`}
                dataKey={additionalField.key}
                data={additionalField.data}
                type={additionalField.type}
              />
            );
          })}
      </div>

      <div className="kanban-board__card-actions">
        <h4 className="kanban-board__card-header">{card.title}</h4>
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
          >
            <IconEdit alt="Edit icon" />
          </a>
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
          >
            <IconDuplicate alt="Duplicate icon" />
          </a>
          <button
            className="action-button icon-delete"
            title="Delete"
            onClick={() => deleteCard(contentObject.id)}
          >
            <IconDelete alt="Delete icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
