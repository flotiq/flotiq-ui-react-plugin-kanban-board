import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 24 24"
          >
            <g>
              <g id="Layer_1">
                <g>
                  <path
                    className="cls-2"
                    style={{
                      fill: '#0083fc',
                    }}
                    d="M12,24c6.6,0,12-5.4,12-12S18.6,0,12,0,0,5.4,0,12s5.4,12,12,12Z"
                  />
                  <path
                    style={{
                      fill: '#0083fc',
                      stroke: '#fff',
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round',
                      strokeWidth: 2,
                    }}
                    d="M17.5,9l-7.3,7-3.7-3.5"
                  />
                </g>
              </g>
            </g>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 0 24 24"
          >
            <g>
              <g id="Layer_1">
                <path
                  style={{ fill: '#eeeef4' }}
                  d="M12,24c6.6,0,12-5.4,12-12S18.6,0,12,0,0,5.4,0,12s5.4,12,12,12Z"
                />
              </g>
            </g>
          </svg>
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
    // transform,
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
        {card.additionalFields?.map((additionalField) => (
          <AdditionalDataRenderer
            key={additionalField.key}
            dataKey={additionalField.key}
            data={additionalField.data}
            type={additionalField.type}
          />
        ))}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 122.4 122.4"
            >
              <g>
                <g id="Layer_1">
                  <g>
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M85,8.1c-.3,0-.5.1-.7.3L8.4,84.3l-2.9-2.9,2.9,2.9c0,0-.2.2-.2.3,0,.1,0,.3,0,.4v28.3c0,.3.1.5.3.7.2.2.4.3.7.3h28.7L114,38.1c.2-.2.3-.4.3-.7s-.1-.5-.3-.7l-28.3-28.3c-.2-.2-.4-.3-.7-.3ZM78.6,2.7c1.7-1.7,4-2.7,6.4-2.7s4.7,1,6.4,2.7l28.3,28.3c1.7,1.7,2.7,4,2.7,6.4s-1,4.7-2.7,6.4L42.3,121.3c-.8.8-1.8,1.2-2.9,1.2H9.1c-2.4,0-4.7-1-6.4-2.7-1.7-1.7-2.7-4-2.7-6.4v-28.3c0-1.2.2-2.4.7-3.5.5-1.1,1.1-2.1,2-3L78.6,2.7Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M61.9,19.3c1.6-1.6,4.1-1.6,5.7,0l35.4,35.4c1.6,1.6,1.6,4.1,0,5.7-1.6,1.6-4.1,1.6-5.7,0L61.9,25.1c-1.6-1.6-1.6-4.1,0-5.7Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 121.5 98.6"
            >
              <g>
                <g id="Layer_1">
                  <g>
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M8.2,25.6c-.2,0-.5,0-.6.3-.2.2-.3.4-.3.6v63.9c0,.2,0,.5.3.6.2.2.4.3.6.3h87.3c.1,0,.2,0,.3-.1s.1-.2.1-.3v-50.7c0-.2,0-.5-.3-.6-.2-.2-.4-.3-.6-.3h-39.6c-1.8,0-3.5-.6-4.9-1.6h0s-15.9-11.9-15.9-11.9c0,0,0,0,0,0-.2-.1-.4-.2-.6-.2H8.2ZM2.4,20.7c1.5-1.5,3.6-2.4,5.8-2.4h25.9c1.8,0,3.5.6,4.9,1.6h0s15.9,11.9,15.9,11.9c0,0,0,0,0,0,.2.1.4.2.6.2h39.5c2.2,0,4.3.9,5.8,2.4,1.5,1.5,2.4,3.6,2.4,5.8v50.7c0,2-.8,4-2.3,5.4-1.4,1.4-3.4,2.3-5.4,2.3H8.2c-2.2,0-4.3-.9-5.8-2.4-1.5-1.5-2.4-3.6-2.4-5.8V26.5c0-2.2.9-4.3,2.4-5.8Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M8.2,25.6c-.2,0-.5,0-.6.3-.2.2-.3.4-.3.6v63.9c0,.2,0,.5.3.6.2.2.4.3.6.3h87.3c.1,0,.2,0,.3-.1s.1-.2.1-.3v-50.7c0-.2,0-.5-.3-.6-.2-.2-.4-.3-.6-.3h-39.6c-1.8,0-3.5-.6-4.9-1.6h0s-15.9-11.9-15.9-11.9c0,0,0,0,0,0-.2-.1-.4-.2-.6-.2H8.2ZM2.4,20.7c1.5-1.5,3.6-2.4,5.8-2.4h25.9c1.8,0,3.5.6,4.9,1.6h0s15.9,11.9,15.9,11.9c0,0,0,0,0,0,.2.1.4.2.6.2h39.5c2.2,0,4.3.9,5.8,2.4,1.5,1.5,2.4,3.6,2.4,5.8v50.7c0,2-.8,4-2.3,5.4-1.4,1.4-3.4,2.3-5.4,2.3H8.2c-2.2,0-4.3-.9-5.8-2.4-1.5-1.5-2.4-3.6-2.4-5.8V26.5c0-2.2.9-4.3,2.4-5.8Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M26.5,7.3c-.2,0-.5,0-.6.3-.2.2-.3.4-.3.6v13.7c0,2-1.6,3.7-3.7,3.7s-3.7-1.6-3.7-3.7v-13.7c0-2.2.9-4.3,2.4-5.8,1.5-1.5,3.6-2.4,5.8-2.4h25.9c1.8,0,3.5.6,4.9,1.6h0s15.9,11.9,15.9,11.9c0,0,0,0,0,0,.2.1.4.2.6.2h39.5c2.2,0,4.3.9,5.8,2.4,1.5,1.5,2.4,3.6,2.4,5.8v50.7c0,2-.8,4-2.3,5.4-1.4,1.4-3.4,2.3-5.4,2.3h-14.2c-2,0-3.7-1.6-3.7-3.7s1.6-3.7,3.7-3.7h14.2c.1,0,.2,0,.3-.1,0,0,.1-.2.1-.3V21.9c0-.2,0-.5-.3-.6-.2-.2-.4-.3-.6-.3h-39.6c-1.8,0-3.5-.6-4.9-1.6h0s-15.9-11.9-15.9-11.9c0,0,0,0,0,0-.2-.1-.4-.2-.6-.2h-25.8Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </a>
          <span
            className="action-button icon-delete"
            title="Delete"
            onClick={() => deleteCard(contentObject.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 90.4 98.1"
            >
              <g>
                <g id="Layer_1">
                  <g>
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M3.1,15.3h84.3c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1H3.1C1.4,21.5,0,20.1,0,18.4c0-1.7,1.4-3.1,3.1-3.1Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M33.7,38.3c1.7,0,3.1,1.4,3.1,3.1v30.7c0,1.7-1.4,3.1-3.1,3.1s-3.1-1.4-3.1-3.1v-30.7c0-1.7,1.4-3.1,3.1-3.1Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M56.7,38.3c1.7,0,3.1,1.4,3.1,3.1v30.7c0,1.7-1.4,3.1-3.1,3.1s-3.1-1.4-3.1-3.1v-30.7c0-1.7,1.4-3.1,3.1-3.1Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M10.7,15.3c1.7,0,3.1,1.4,3.1,3.1v72.8c0,.2,0,.4.2.5.1.1.3.2.5.2h61.3c.2,0,.4,0,.5-.2.1-.1.2-.3.2-.5V18.4c0-1.7,1.4-3.1,3.1-3.1s3.1,1.4,3.1,3.1v72.8c0,1.8-.7,3.6-2,4.9-1.3,1.3-3,2-4.9,2H14.6c-1.8,0-3.6-.7-4.9-2-1.3-1.3-2-3-2-4.9V18.4c0-1.7,1.4-3.1,3.1-3.1Z"
                    />
                    <path
                      style={{ fill: '#fff', fillRule: 'evenodd' }}
                      d="M26.1,3.1c2-2,4.7-3.1,7.6-3.1h23c2.8,0,5.6,1.1,7.6,3.1,2,2,3.1,4.7,3.1,7.6v7.7c0,1.7-1.4,3.1-3.1,3.1s-3.1-1.4-3.1-3.1v-7.7c0-1.2-.5-2.4-1.3-3.3-.9-.9-2-1.3-3.3-1.3h-23c-1.2,0-2.4.5-3.3,1.3-.9.9-1.3,2-1.3,3.3v7.7c0,1.7-1.4,3.1-3.1,3.1s-3.1-1.4-3.1-3.1v-7.7c0-2.8,1.1-5.6,3.1-7.6Z"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
