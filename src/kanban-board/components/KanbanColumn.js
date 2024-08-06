import { useCallback, useEffect, useMemo, useState } from 'react';
import KanbanCard from './KanbanCard';
import { SortableContext } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

const KanbanColumn = ({ column, cardsArray, getApiUrl }) => {
  const [cards, setCards] = useState(cardsArray);

  const { setNodeRef } = useDroppable({
    id: column,
    data: { type: 'Column' },
  });

  useEffect(() => {
    setCards(cardsArray);
  }, [cardsArray]);

  const cardsIds = useMemo(
    () => cards?.map((card) => card?.contentObject?.id) || [],
    [cards],
  );
  return (
    <div className="kanban-board__column-container">
      <div className="kanban-board__column-header">{column}</div>
      <div className="kanban-board__column-body" ref={setNodeRef}>
        <SortableContext items={cardsIds} id={column}>
          {cards?.map(({ card, contentObject }) => (
            <KanbanCard
              card={card}
              contentObject={contentObject}
              key={contentObject.id}
              getApiUrl={getApiUrl}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
