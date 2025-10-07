export const ActionTypes = {
  // === Card Actions ===
  ADD_CARD: 'ADD_CARD',
  UPDATE_CARD: 'UPDATE_CARD',
  DELETE_CARD: 'DELETE_CARD',
  MOVE_CARD: 'MOVE_CARD', 

  // === Column Actions ===
  ADD_COLUMN: 'ADD_COLUMN',
  UPDATE_COLUMN: 'UPDATE_COLUMN',
  DELETE_COLUMN: 'DELETE_COLUMN',
  MOVE_COLUMN: 'MOVE_COLUMN', 
};

export const generateCardId = () =>
  `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const generateColumnId = () =>
  `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// --- Card Actions ---
export const addCard = (id, columnId, content) => ({
  type: ActionTypes.ADD_CARD,
  payload: { id, columnId, content },
});

export const updateCard = (cardId, content) => ({
  type: ActionTypes.UPDATE_CARD,
  payload: { cardId, content },
});

export const deleteCard = (cardId) => ({
  type: ActionTypes.DELETE_CARD,
  payload: { cardId },
});

export const moveCard = (cardId, targetColumnId, targetIndex) => ({
  type: ActionTypes.MOVE_CARD,
  payload: { cardId, targetColumnId, targetIndex },
});


// --- Column Actions ---
export const addColumn = (id, title) => ({
  type: ActionTypes.ADD_COLUMN,
  payload: { id, title },
});

export const updateColumn = (columnId, title) => ({
  type: ActionTypes.UPDATE_COLUMN,
  payload: { columnId, title },
});

export const deleteColumn = (columnId) => ({
  type: ActionTypes.DELETE_COLUMN,
  payload: { columnId },
});

export const moveColumn = (columnId, targetIndex) => ({
  type: ActionTypes.MOVE_COLUMN,
  payload: { columnId, targetIndex },
});
