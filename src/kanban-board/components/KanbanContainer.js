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
import { extractFieldType } from '../helpers';
import debounce from 'debounce';
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

  const { apiClient, getApiUrl } = client;
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

      return `${getApiUrl()}/image/0x0/${image.id}.${image.extension}`;
    },
    [getApiUrl],
  );

  const fetchContentObjects = useCallback(() => {
    setIsLoading(true);
    apiClient.list({ hydrate: 1 }).then((data) => {
      if (data.status === 200) {
        setContentObjects(data.body.data);
      } else {
        toast.error(i18n.t('FetchError'));
      }

      setIsLoading(false);
    });
  }, [apiClient, toast]);

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

      const deleteResult = await apiClient.delete(cardId);

      if (deleteResult.status === 204) {
        fetchContentObjects();
        toast.success(i18n.t('CardDelete'));
        return;
      }
      toast.error(i18n.t('FetchError'));
    },
    [openModal, apiClient, toast, fetchContentObjects],
  );

  const cardData = useMemo(() => {
    // const acc = [];
    if (contentObjects.length === 0) return [];

    return contentObjects?.reduce((acc, object) => {
      const card = {
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
            ...extractFieldType(
              contentDefinition,
              pluginConfig[additionalFieldKey],
            ),
          })),
          title: getCardValueFromConfig('title', object, pluginConfig),
          image: getImageFromCo('image', object, pluginConfig),
        },
      };

      if (!acc) {
        return { [object.id]: card };
      }

      acc[object.id] = card;
      return acc;
    }, {});
    // return acc;
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

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Card') {
      setSelectedCard({
        card: event.active.data.current.card,
        contentObject: event.active.data.current.contentObject,
      });
    }
  }, []);

  const changeCardOrder = (
    cards,
    currentColumn,
    currentCardId,
    targetCardId,
  ) => {
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
  };

  const handleCardColumnUpdate = (
    currentColumnId,
    targetColumnId,
    activeCard,
    overCardId = null,
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
      if (overCardId) {
        changeCardOrder(
          cardsCopy,
          targetColumnId,
          activeCard.contentObject.id,
          overCardId,
        );
      }
      return cardsCopy;
    });
  };

  const handleCardOrderUpdate = (
    currentCardId,
    targetCardId,
    currentColumn,
  ) => {
    setCards((cards) => {
      const cardCopy = { ...cards };
      return changeCardOrder(
        cardCopy,
        currentColumn,
        currentCardId,
        targetCardId,
      );
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
      const overCardId = over.id;

      if (currentColumnId === targetColumnId) return;

      handleCardColumnUpdate(
        currentColumnId,
        targetColumnId,
        activeCard,
        overCardId,
      );
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
      const currentColumn = active.data.current.sortable.containerId;

      handleCardOrderUpdate(activeCardId, overCardId, currentColumn);
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
        onDragOver={debounce(onDragOver, 75)}
        onDragEnd={onDragEnd}
        sensors={sensors}
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
