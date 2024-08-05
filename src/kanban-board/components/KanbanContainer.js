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
import { arrayMove, arraySwap } from '@dnd-kit/sortable';

const KanbanContainer = ({ kanbanColumns, contentObjects, selectedField }) => {
  const [cards, setCards] = useState({});

  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const cardsObj = {};

    kanbanColumns?.forEach((column) => {
      cardsObj[column] = contentObjects?.filter(
        (object) => object[selectedField] === column,
      );
    });

    setCards(cardsObj);
  }, [kanbanColumns, contentObjects, selectedField]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Card') {
      setSelectedCard(event.active.data.current.card);
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
        (card) => card.id !== activeCard.id,
      );

      cardsCopy[targetColumnId].push({ ...activeCard });

      return cardsCopy;
    });
  };

  const handleCardOrderUpdate = (currentCard, targetCard, currentColumn) => {
    setCards((cards) => {
      const cardCopy = { ...cards };

      const currentCardId = cardCopy[currentColumn].findIndex(
        (card) => card.id === currentCard.id,
      );

      const targetCardId = cardCopy[currentColumn].findIndex(
        (card) => card.id === targetCard.id,
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

    const activeCard = active.data.current.card;
    const currentColumnId = active.data.current.sortable.containerId;

    if (isOverCard) {
      //handle dragging over card from other column
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

  const onDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    const activeCardId = active.id;
    const overCardId = over.id;

    if (activeCardId === overCardId) return;

    const isOverCard = over.data.current?.type === 'Card';

    if (selectedCard && isOverCard) {
      const activeCard = active.data.current.card;
      const overCard = over.data.current.card;
      const currentColumn = active.data.current.sortable.containerId;

      handleCardOrderUpdate(activeCard, overCard, currentColumn);
    }

    setSelectedCard(null);
  };

  const columnsContainer = useMemo(
    () => (
      <div className="kanban-board__container">
        {kanbanColumns?.map((column) => (
          <KanbanColumn column={column} cardsArray={cards[column]} />
        ))}
      </div>
    ),
    [kanbanColumns, cards],
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
            {selectedCard && <KanbanCard card={selectedCard} />}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </div>
  );
};

export default KanbanContainer;
