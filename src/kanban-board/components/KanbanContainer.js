import { useCallback, useEffect, useMemo, useState } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { createPortal } from 'react-dom';

const KanbanContainer = ({ kanbanColumns, contentObjects, selectedField }) => {
  const [cards, setCards] = useState({});

  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const cardsObj = {};

    kanbanColumns?.forEach((column) => {
      cardsObj[column] = contentObjects?.filter(
        (object) => object[selectedField] === column,
      );
    });

    setCards(cardsObj);
  }, [kanbanColumns, contentObjects, selectedField]);

  const onDragStart = useCallback((event) => {
    if (event.active.data.current?.type === 'Card') {
      setActiveCard(event.active.data.current.card);
    }
  }, []);

  useMemo(() => console.log(activeCard), [activeCard]);

  return (
    <div className="kanban-board-ui-plugin__container">
      <DndContext onDragStart={onDragStart}>
        <div className="kanban-board__container">
          {kanbanColumns?.map((column) => (
            <KanbanColumn column={column} cardsArray={cards[column]} />
          ))}
        </div>
        <DragOverlay>
          {activeCard && <KanbanCard card={activeCard} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanContainer;
