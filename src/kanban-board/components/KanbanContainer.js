import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { createPortal } from 'react-dom';
import { arrayMove } from '@dnd-kit/sortable';

const KanbanContainer = ({
  kanbanColumns,
  selectedField,
  client,
  pluginConfig,
}) => {
  const [contentObjects, setContentObjects] = useState([]);
  const [cards, setCards] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const { apiClient, getApiUrl } = client;

  const getCardValueFromConfig = (configKey, contentObject, config) => {
    const objectKey = config[configKey]?.key;
    return contentObject[objectKey];
  };

  const getImageFromCo = (configKey, contentObject, config) => {
    const objectKey = config[configKey]?.key;
    const image = contentObject[objectKey]?.[0];

    if (!image) return '';

    return `${getApiUrl()}/image/0x0/${image.id}.${image.extension}`;
  };

  useEffect(() => {
    setIsLoading(true);
    apiClient.list({ hydrate: 1 }).then((data) => {
      if (data.status !== 200) return;
      setContentObjects(data.body.data);
      setIsLoading(false);
    });
  }, [apiClient]);

  useEffect(() => {
    const cardsObj = {};
    kanbanColumns?.forEach((column) => {
      cardsObj[column] = [];
      contentObjects?.forEach((object) => {
        if (object[selectedField] === column) {
          cardsObj[column].push({
            contentObject: object,
            card: {
              additionalFields: [
                'additional_field_1',
                'additional_field_2',
                'additional_field_3',
              ].map((additionalFieldKey) => ({
                data: getCardValueFromConfig(
                  additionalFieldKey,
                  object,
                  pluginConfig,
                ),
                ...pluginConfig[additionalFieldKey],
              })),
              title: getCardValueFromConfig('title', object, pluginConfig),
              image: getImageFromCo('image', object, pluginConfig),
            },
          });
        }
      });
    });

    setCards(cardsObj);
  }, [
    kanbanColumns,
    contentObjects,
    selectedField,
    getImageFromCo,
    pluginConfig,
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Card') {
      setSelectedCard({
        card: event.active.data.current.card,
        contentObject: event.active.data.current.contentObject,
      });
    }
  }, []);

  const handleCardColumnUpdate = (
    currentColumnId,
    targetColumnId,
    activeCard,
  ) => {
    setCards((cards) => {
      const cardsCopy = { ...cards };

      cardsCopy[currentColumnId] = cardsCopy[currentColumnId].filter(
        ({ contentObject }) => contentObject.id !== activeCard.contentObject.id,
      );

      const activeCardCopy = { ...activeCard };

      activeCardCopy.contentObject = {
        ...activeCardCopy.contentObject,
        [selectedField]: targetColumnId,
      };

      cardsCopy[targetColumnId].push(activeCardCopy);

      return cardsCopy;
    });
  };

  const handleCardOrderUpdate = (currentCard, targetCard, currentColumn) => {
    setCards((cards) => {
      const cardCopy = { ...cards };

      const currentCardId = cardCopy[currentColumn].findIndex(
        ({ contentObject }) =>
          contentObject.id === currentCard.contentObject.id,
      );

      const targetCardId = cardCopy[currentColumn].findIndex(
        ({ contentObject }) => contentObject.id === targetCard.contentObject.id,
      );

      cardCopy[currentColumn] = arrayMove(
        cardCopy[currentColumn],
        currentCardId,
        targetCardId,
      );

      return cardCopy;
    });
  };

  const onDragOver = (event) => {
    const { active, over } = event;

    if (!over || !selectedCard) return;

    const activeCardId = active.id;
    const overCardId = over.id;

    if (activeCardId === overCardId) return;

    const isOverCard = over.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    const activeCard = {
      card: active.data.current.card,
      contentObject: active.data.current.contentObject,
    };
    const currentColumnId = active.data.current.sortable.containerId;

    //handle dragging over card from other column
    if (isOverCard) {
      const targetColumnId = over.data.current.sortable.containerId;

      if (currentColumnId === targetColumnId) return;

      handleCardColumnUpdate(currentColumnId, targetColumnId, activeCard);
    }

    //handle dragging over other column
    if (isOverColumn) {
      const targetColumnId = over.id;
      handleCardColumnUpdate(currentColumnId, targetColumnId, activeCard);
    }
  };

  const onDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeCardId = active.id;
    const overCardId = over.id;

    if (activeCardId === overCardId) {
      const targetColumnId = active.data.current.contentObject[selectedField];
      await apiClient.patch(activeCardId, {
        [selectedField]: targetColumnId,
      });

      return;
    }

    const isOverCard = over.data.current?.type === 'Card';

    if (selectedCard && isOverCard) {
      const activeCard = {
        card: active.data.current.card,
        contentObject: active.data.current.contentObject,
      };
      const overCard = {
        card: over.data.current.card,
        contentObject: over.data.current.contentObject,
      };
      const currentColumn = active.data.current.sortable.containerId;

      handleCardOrderUpdate(activeCard, overCard, currentColumn);
    }

    setSelectedCard(null);
  };

  const loader = useMemo(
    () => (
      <div className="kanban-board-ui-plugin__loader-container">
        <div className="kanban-board-ui-plugin__loader"></div>
      </div>
    ),
    [],
  );

  const columnsContainer = useMemo(
    () => (
      <div className="kanban-board__container">
        {!isLoading
          ? kanbanColumns?.map((column) => (
              <KanbanColumn
                column={column}
                cardsArray={cards[column]}
                key={column}
              />
            ))
          : loader}
      </div>
    ),
    [kanbanColumns, cards, isLoading, loader],
  );

  return (
    <div className="kanban-board-ui-plugin__container">
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        {columnsContainer}
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {selectedCard && (
              <KanbanCard
                {...selectedCard}
                additionalClasses={'kanban-board__card-container--dragged'}
              />
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanContainer;
