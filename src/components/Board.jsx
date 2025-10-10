import { useReducer } from 'react';
import { boardReducer } from '../reducers/boardReducer';
import { initialState } from '../reducers/initialState';
import { BoardProvider } from '../context/BoardContext';
import Column from './Column';

function Board() {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardProvider dispatch={dispatch}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {state.columns.allIds.map((columnId) => {
          const column = state.columns.byId[columnId];

          const cards = column.cardIds
            .map((cardId) => {
              const card = state.cards.byId[cardId];
              if (!card) {
                console.error(`Card ${cardId} not found in column ${columnId}`);
                return null;
              }
              // 把 id 加回去（因為 state.cards.byId 不存 id）
              return { id: cardId, ...card };
            })
            .filter(Boolean);

          return (
            <Column
              key={columnId}
              columnId={columnId}
              column={column}
              cards={cards}
            />
          );
        })}
      </div>
    </BoardProvider>
  );
}

export default Board;
