import { useMemo } from 'react';
import KanbanCard from './KanbanCard';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';

const KanbanColumn = ({ column, cardsArray, deleteCard }) => {
  const { setNodeRef } = useDroppable({
    id: column,
    data: { type: 'Column' },
  });

  const cardsIds = useMemo(
    () => cardsArray?.map((card) => card?.contentObject?.id) || [],
    [cardsArray],
  );

  return (
    <div className="kanban-board__column-container">
      <div className="kanban-board__column-header">{column}</div>
      <div className="kanban-board__column-body" ref={setNodeRef}>
        <SortableContext
          items={cardsIds}
          id={column}
          strategy={verticalListSortingStrategy}
        >
          {cardsArray?.map(({ card, contentObject }) => (
            <KanbanCard
              card={card}
              contentObject={contentObject}
              key={contentObject.id}
              deleteCard={deleteCard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
