import { useReducer } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { boardReducer } from '../reducers/boardReducer';
import { initialState } from '../reducers/initialState';
import { BoardProvider } from '../context/BoardContext';
import { moveCard } from '../reducers/actions';
import Column from './Column';

function Board() {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return; 

    const activeId = active.id;
    const overId = over.id; 

    const activeCard = state.cards.byId[activeId];
    if (!activeCard) return;

    const sourceColumnId = activeCard.columnId;

    let targetColumnId;
    let targetIndex;

    if (state.cards.byId[overId]) {
      const overCard = state.cards.byId[overId];
      targetColumnId = overCard.columnId;
      const targetColumn = state.columns.byId[targetColumnId];
      targetIndex = targetColumn.cardIds.indexOf(overId);
    } else if (state.columns.byId[overId]) {
      targetColumnId = overId;
      targetIndex = 0;
    } else {
      return; 
    }

    if (sourceColumnId === targetColumnId) {
      const sourceColumn = state.columns.byId[sourceColumnId];
      const currentIndex = sourceColumn.cardIds.indexOf(activeId);
      if (currentIndex === targetIndex) return;
    }

    dispatch(moveCard(activeId, targetColumnId, targetIndex));
  };

  return (
    <BoardProvider dispatch={dispatch}>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {state.columns.allIds.map((columnId, columnIndex) => {
            const column = state.columns.byId[columnId];

            const cards = column.cardIds
              .map((cardId) => {
                const card = state.cards.byId[cardId];
                if (!card) {
                  console.error(`Card ${cardId} not found in column ${columnId}`);
                  return null;
                }
                return { id: cardId, ...card };
              })
              .filter(Boolean);

            const nextColumnId = state.columns.allIds[columnIndex + 1] || null;

            return (
              <Column
                key={columnId}
                columnId={columnId}
                column={column}
                cards={cards}
                nextColumnId={nextColumnId}
              />
            );
          })}
        </div>
      </DndContext>
    </BoardProvider>
  );
}

export default Board;
