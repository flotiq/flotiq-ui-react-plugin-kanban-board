import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { createPortal } from 'react-dom';
import { arrayMove } from '@dnd-kit/sortable';
import { extractFieldType } from '../helpers';
import i18n from '../../i18n';

const KanbanContainer = ({
  kanbanColumns,
  selectedField,
  client,
  pluginConfig,
  contentDefinition,
  openModal,
  toast,
}) => {
  const [contentObjects, setContentObjects] = useState([]);
  const [cards, setCards] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const getCardValueFromConfig = useCallback(
    (configKey, contentObject, config) => {
      const objectKey = config[configKey];
      return contentObject[objectKey];
    },
    [],
  );

  const getImageFromCo = useCallback(
    (configKey, contentObject, config) => {
      const objectKey = config[configKey];
      const image = contentObject[objectKey]?.[0];

      if (!image) return '';

      return client.getMediaUrl(image, 200, 200);
    },
    [client],
  );

  const fetchContentObjects = useCallback(() => {
    setIsLoading(true);

    client[contentDefinition.name]
      .list({ hydrate: 1, limit: 50 })
      .then((data) => {
        if (data.ok) {
          setContentObjects(data.body.data);
        } else {
          toast.error(i18n.t('FetchError'));
        }

        setIsLoading(false);
      })
      .catch(() => {
        toast.error(i18n.t('FetchError'));
      });
  }, [client, contentDefinition.name, toast]);

  useEffect(() => fetchContentObjects(), [fetchContentObjects]);

  const deleteCard = useCallback(
    async (cardId) => {
      const result = await openModal({
        title: 'Warning!',
        content: 'Are you sure that you want to delete 1 Content Object?',
        buttons: [
          {
            key: 'delete',
            label: 'Delete',
            result: true,
          },
          {
            key: 'cancel',
            label: 'Cancel',
            result: false,
            color: 'grayBordered',
          },
        ],
      });

      if (!result) return;
      try {
        const deleteResult =
          await client[contentDefinition.name].delete(cardId);

        if (deleteResult.ok) {
          fetchContentObjects();
          toast.success(i18n.t('CardDelete'));
          return;
        }
        toast.error(i18n.t('FetchError'));
      } catch (e) {
        toast.error(i18n.t('FetchError'));
      }
    },
    [openModal, client, contentDefinition.name, toast, fetchContentObjects],
  );

  const cardData = useMemo(() => {
    if (contentObjects.length === 0) return [];

    return contentObjects?.reduce((acc, object) => {
      const card = {
        contentObject: object,
        card: {
          additionalFields: [
            'additional_field_1',
            'additional_field_2',
            'additional_field_3',
          ]?.map((additionalFieldKey) => ({
            data: getCardValueFromConfig(
              additionalFieldKey,
              object,
              pluginConfig,
            ),
            ...extractFieldType(
              contentDefinition,
              pluginConfig[additionalFieldKey],
            ),
          })),
          title: getCardValueFromConfig('title', object, pluginConfig),
          image: getImageFromCo('image', object, pluginConfig),
        },
      };

      acc[object.id] = card;
      return acc;
    }, {});
  }, [
    contentObjects,
    getCardValueFromConfig,
    getImageFromCo,
    contentDefinition,
    pluginConfig,
  ]);

  useEffect(() => {
    const cardsObj = {};
    kanbanColumns?.forEach((column) => {
      cardsObj[column] = [];
      contentObjects?.forEach((object) => {
        if (object[selectedField] === column) {
          cardsObj[column].push(cardData[object.id]);
        }
      });
    });

    setCards(cardsObj);
  }, [kanbanColumns, contentObjects, cardData, selectedField]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const onDragStart = useCallback(
    (event) => {
      if (event.active.data.current?.type === 'Card') {
        const draggedCard = cardData[event.active.id];
        setSelectedCard(draggedCard);
      }
    },
    [cardData],
  );

  const changeCardOrder = useCallback(
    (cards, currentColumn, currentCardId, targetCardId) => {
      const currentCardIndex = cards[currentColumn].findIndex(
        ({ contentObject }) => contentObject.id === currentCardId,
      );

      const targetCardIndex = cards[currentColumn].findIndex(
        ({ contentObject }) => contentObject.id === targetCardId,
      );

      cards[currentColumn] = arrayMove(
        cards[currentColumn],
        currentCardIndex,
        targetCardIndex,
      );

      return cards;
    },
    [],
  );

  const handleCardColumnUpdate = useCallback(
    (currentColumnId, targetColumnId, activeId, overCardId = null) => {
      setCards((cards) => {
        const cardsCopy = { ...cards };

        cardsCopy[currentColumnId] = cardsCopy[currentColumnId].filter(
          ({ contentObject }) => contentObject.id !== activeId,
        );

        const activeCard = cardData[activeId];

        activeCard.contentObject = {
          ...activeCard.contentObject,
          [selectedField]: targetColumnId,
        };

        cardsCopy[targetColumnId].push(activeCard);

        if (overCardId) {
          changeCardOrder(cardsCopy, targetColumnId, activeCard.id, overCardId);
        }
        return cardsCopy;
      });
    },
    [cardData, changeCardOrder, selectedField],
  );

  const handleCardOrderUpdate = useCallback(
    (currentCardId, targetCardId, currentColumn) => {
      setCards((cards) => {
        const cardCopy = { ...cards };
        return changeCardOrder(
          cardCopy,
          currentColumn,
          currentCardId,
          targetCardId,
        );
      });
    },
    [changeCardOrder],
  );

  const onDragOver = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over || !selectedCard) return;

      const activeCardId = active.id;
      const overCardId = over.id;

      if (activeCardId === overCardId) return;

      const isOverCard = over.data.current?.type === 'Card';
      const isOverColumn = over.data.current?.type === 'Column';

      const currentColumnId = active.data.current.sortable.containerId;

      //handle dragging over card from other column
      if (isOverCard) {
        const targetColumnId = over.data.current.sortable.containerId;
        const overCardId = over.id;

        if (currentColumnId === targetColumnId) return;

        handleCardColumnUpdate(
          currentColumnId,
          targetColumnId,
          activeCardId,
          overCardId,
        );
      }

      //handle dragging over other column
      if (isOverColumn) {
        const targetColumnId = over.id;
        handleCardColumnUpdate(currentColumnId, targetColumnId, activeCardId);
      }
    },
    [handleCardColumnUpdate, selectedCard],
  );

  const onDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      if (!over) return;

      const activeCardId = active.id;
      const overCardId = over.id;

      if (over.data.current?.type === 'Column' || activeCardId === overCardId) {
        const targetColumnId = active.data.current.sortable.containerId;
        try {
          await client[contentDefinition.name].patch(activeCardId, {
            [selectedField]: targetColumnId,
          });
        } catch (e) {
          toast.error(i18n.t('FetchError'));
        }

        return;
      }

      const isOverCard = over.data.current?.type === 'Card';

      if (selectedCard && isOverCard) {
        const currentColumn = active.data.current.sortable.containerId;

        handleCardOrderUpdate(activeCardId, overCardId, currentColumn);
      }

      setSelectedCard(null);
    },
    [
      client,
      contentDefinition.name,
      handleCardOrderUpdate,
      selectedCard,
      selectedField,
      toast,
    ],
  );

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
                deleteCard={deleteCard}
                key={column}
              />
            ))
          : loader}
      </div>
    ),
    [kanbanColumns, cards, isLoading, loader, deleteCard],
  );

  return (
    <div className="kanban-board-ui-plugin__container">
      <DndContext
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        sensors={sensors}
        collisionDetection={pointerWithin}
        autoScroll={{ acceleration: 1 }}
      >
        {columnsContainer}
        {createPortal(
          <DragOverlay dropAnimation={null}>
            {selectedCard && (
              <KanbanCard
                {...selectedCard}
                additionalClasses={' kanban-board__card-container--dragged'}
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
