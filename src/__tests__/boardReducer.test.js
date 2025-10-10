import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { boardReducer } from '../reducers/boardReducer';
import {
  addCard,
  updateCard,
  deleteCard,
  moveCard,
  addColumn,
  updateColumn,
  deleteColumn,
  moveColumn,
} from '../reducers/actions';

// ==================== Helper Functions ====================

function createInitialState() {
  return {
    columns: {
      byId: {
        'col-1': { title: 'To Do', cardIds: ['card-1', 'card-2'] },
        'col-2': { title: 'In Progress', cardIds: ['card-3'] },
        'col-3': { title: 'Done', cardIds: [] },
      },
      allIds: ['col-1', 'col-2', 'col-3'],
    },
    cards: {
      byId: {
        'card-1': { content: 'Task 1', columnId: 'col-1' },
        'card-2': { content: 'Task 2', columnId: 'col-1' },
        'card-3': { content: 'Task 3', columnId: 'col-2' },
      },
      allIds: ['card-1', 'card-2', 'card-3'],
    },
  };
}

// ==================== Immutability Tests (測試 Immer 配置) ====================

describe('boardReducer - Immutability', () => {
  it('should not mutate original state for any action', () => {
    const state = createInitialState();
    const originalState = JSON.parse(JSON.stringify(state));

    // 測試所有 actions 都不會 mutate
    boardReducer(state, addCard('card-4', 'col-1', 'Test'));
    expect(state).toEqual(originalState);

    boardReducer(state, updateCard('card-1', 'Updated'));
    expect(state).toEqual(originalState);

    boardReducer(state, deleteCard('card-1'));
    expect(state).toEqual(originalState);

    boardReducer(state, moveCard('card-1', 'col-2', 0));
    expect(state).toEqual(originalState);
  });
});

// ==================== ADD_CARD Tests ====================

describe('boardReducer - ADD_CARD', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should add card to empty column', () => {
    const state = {
      columns: {
        byId: {
          'col-1': { title: 'To Do', cardIds: [] },
        },
        allIds: ['col-1'],
      },
      cards: {
        byId: {},
        allIds: [],
      },
    };

    const newState = boardReducer(state, addCard('card-1', 'col-1', 'Test card'));

    expect(newState.cards.byId['card-1']).toEqual({
      content: 'Test card',
      columnId: 'col-1',
    });
    expect(newState.cards.allIds).toContain('card-1');
    expect(newState.columns.byId['col-1'].cardIds).toContain('card-1');
  });

  it('should add card to column with existing cards', () => {
    const state = createInitialState();

    const newState = boardReducer(state, addCard('card-4', 'col-1', 'New card'));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-1', 'card-2', 'card-4']);
    expect(newState.cards.allIds).toEqual(['card-1', 'card-2', 'card-3', 'card-4']);
  });

  it('should add card with empty string content', () => {
    const state = createInitialState();

    const newState = boardReducer(state, addCard('card-4', 'col-1', ''));

    expect(newState.cards.byId['card-4'].content).toBe('');
    expect(newState.columns.byId['col-1'].cardIds).toContain('card-4');
  });

  it('should not add card when column does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, addCard('card-4', 'non-existent', 'Test'));

    expect(newState.cards.byId['card-4']).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Column non-existent not found');
  });
});

// ==================== UPDATE_CARD Tests ====================

describe('boardReducer - UPDATE_CARD', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should update card content', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateCard('card-1', 'Updated content'));

    expect(newState.cards.byId['card-1'].content).toBe('Updated content');
    expect(newState.cards.byId['card-1'].columnId).toBe('col-1');
  });

  it('should update card with empty string content', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateCard('card-1', ''));

    expect(newState.cards.byId['card-1'].content).toBe('');
  });

  it('should not update when card does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateCard('non-existent', 'New content'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Card non-existent not found');
    expect(newState).toEqual(state);
  });
});

// ==================== DELETE_CARD Tests ====================

describe('boardReducer - DELETE_CARD', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should delete card from column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteCard('card-1'));

    expect(newState.cards.byId['card-1']).toBeUndefined();
    expect(newState.cards.allIds).toEqual(['card-2', 'card-3']);
    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2']);
  });

  it('should delete the only card in column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteCard('card-3'));

    expect(newState.cards.byId['card-3']).toBeUndefined();
    expect(newState.columns.byId['col-2'].cardIds).toEqual([]);
  });

  it('should not delete when card does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteCard('non-existent'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Card non-existent not found');
    expect(newState).toEqual(state);
  });
});

// ==================== MOVE_CARD Tests ====================

describe('boardReducer - MOVE_CARD', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should move card to different column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'col-2', 1));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2']);
    expect(newState.columns.byId['col-2'].cardIds).toEqual(['card-3', 'card-1']);
    expect(newState.cards.byId['card-1'].columnId).toBe('col-2');
  });

  it('should move card within same column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-2', 'col-1', 0));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('should move card to empty column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'col-3', 0));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2']);
    expect(newState.columns.byId['col-3'].cardIds).toEqual(['card-1']);
    expect(newState.cards.byId['card-1'].columnId).toBe('col-3');
  });

  it('should handle positive out-of-bounds targetIndex', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'col-2', 999));

    expect(newState.columns.byId['col-2'].cardIds).toEqual(['card-3', 'card-1']);
  });

  it('should handle negative targetIndex', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'col-2', -5));

    // 應該被 clamp 到 0
    expect(newState.columns.byId['col-2'].cardIds).toEqual(['card-1', 'card-3']);
  });

  it('should not move when card does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('non-existent', 'col-2', 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Card non-existent not found');
  });

  it('should not move when target column does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'non-existent', 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Target column non-existent not found');
  });
});

// ==================== ADD_COLUMN Tests ====================

describe('boardReducer - ADD_COLUMN', () => {
  it('should add new column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, addColumn('col-4', 'New Column'));

    expect(newState.columns.byId['col-4']).toEqual({
      title: 'New Column',
      cardIds: [],
    });
    expect(newState.columns.allIds).toEqual(['col-1', 'col-2', 'col-3', 'col-4']);
  });

  it('should add column with empty string title', () => {
    const state = createInitialState();

    const newState = boardReducer(state, addColumn('col-4', ''));

    expect(newState.columns.byId['col-4'].title).toBe('');
    expect(newState.columns.allIds).toContain('col-4');
  });
});

// ==================== UPDATE_COLUMN Tests ====================

describe('boardReducer - UPDATE_COLUMN', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should update column title', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateColumn('col-1', 'Updated Title'));

    expect(newState.columns.byId['col-1'].title).toBe('Updated Title');
    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-1', 'card-2']);
  });

  it('should update column with empty string title', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateColumn('col-1', ''));

    expect(newState.columns.byId['col-1'].title).toBe('');
  });

  it('should not update when column does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, updateColumn('non-existent', 'New Title'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Column non-existent not found');
    expect(newState).toEqual(state);
  });
});

// ==================== DELETE_COLUMN Tests ====================

describe('boardReducer - DELETE_COLUMN', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should delete column and all its cards', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteColumn('col-1'));

    expect(newState.columns.byId['col-1']).toBeUndefined();
    expect(newState.columns.allIds).toEqual(['col-2', 'col-3']);
    expect(newState.cards.byId['card-1']).toBeUndefined();
    expect(newState.cards.byId['card-2']).toBeUndefined();
    expect(newState.cards.allIds).toEqual(['card-3']);
  });

  it('should delete empty column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteColumn('col-3'));

    expect(newState.columns.byId['col-3']).toBeUndefined();
    expect(newState.columns.allIds).toEqual(['col-1', 'col-2']);
    expect(newState.cards.allIds).toEqual(['card-1', 'card-2', 'card-3']);
  });

  it('should not delete when column does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, deleteColumn('non-existent'));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Column non-existent not found');
    expect(newState).toEqual(state);
  });
});

// ==================== MOVE_COLUMN Tests ====================

describe('boardReducer - MOVE_COLUMN', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should move column to different position', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveColumn('col-1', 2));

    expect(newState.columns.allIds).toEqual(['col-2', 'col-3', 'col-1']);
  });

  it('should move column to first position', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveColumn('col-3', 0));

    expect(newState.columns.allIds).toEqual(['col-3', 'col-1', 'col-2']);
  });

  it('should handle positive out-of-bounds targetIndex', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveColumn('col-1', 999));

    expect(newState.columns.allIds).toEqual(['col-2', 'col-3', 'col-1']);
  });

  it('should handle negative targetIndex', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveColumn('col-3', -10));

    // 應該被 clamp 到 0
    expect(newState.columns.allIds).toEqual(['col-3', 'col-1', 'col-2']);
  });

  it('should not move when column does not exist', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveColumn('non-existent', 0));

    expect(consoleErrorSpy).toHaveBeenCalledWith('Column non-existent not found');
  });
});

// ==================== Edge Cases Tests ====================

describe('boardReducer - Edge Cases', () => {
  let consoleErrorSpy;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle adding card with very long content', () => {
    const state = createInitialState();
    const longContent = 'A'.repeat(10000);

    const newState = boardReducer(state, addCard('card-4', 'col-1', longContent));

    expect(newState.cards.byId['card-4'].content).toBe(longContent);
  });

  it('should handle adding column with special characters in title', () => {
    const state = createInitialState();
    const specialTitle = '🚀 Test & "Column" <with> symbols';

    const newState = boardReducer(state, addColumn('col-4', specialTitle));

    expect(newState.columns.byId['col-4'].title).toBe(specialTitle);
  });

  it('should handle moving card to index 0 in same column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-2', 'col-1', 0));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('should handle moving card to last position in same column', () => {
    const state = createInitialState();

    const newState = boardReducer(state, moveCard('card-1', 'col-1', 1));

    expect(newState.columns.byId['col-1'].cardIds).toEqual(['card-2', 'card-1']);
  });

  it('should handle deleting column with many cards', () => {
    const state = {
      columns: {
        byId: {
          'col-1': { title: 'Test', cardIds: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'] },
        },
        allIds: ['col-1'],
      },
      cards: {
        byId: {
          'card-1': { content: 'C1', columnId: 'col-1' },
          'card-2': { content: 'C2', columnId: 'col-1' },
          'card-3': { content: 'C3', columnId: 'col-1' },
          'card-4': { content: 'C4', columnId: 'col-1' },
          'card-5': { content: 'C5', columnId: 'col-1' },
        },
        allIds: ['card-1', 'card-2', 'card-3', 'card-4', 'card-5'],
      },
    };

    const newState = boardReducer(state, deleteColumn('col-1'));

    expect(newState.columns.allIds).toEqual([]);
    expect(newState.cards.allIds).toEqual([]);
    expect(Object.keys(newState.cards.byId)).toEqual([]);
  });
});
