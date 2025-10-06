export const initialState = {
  columns: {
    byId: {
      'col-1': {
        id: 'col-1',
        title: 'To Do',
        cardIds: ['card-1', 'card-2'],
      },
      'col-2': {
        id: 'col-2',
        title: 'In Progress',
        cardIds: ['card-3'],
      },
      'col-3': {
        id: 'col-3',
        title: 'Done',
        cardIds: [],  // 空的欄位
      },
    },
    allIds: ['col-1', 'col-2', 'col-3'],
  },

  cards: {
    byId: {
      'card-1': {
        id: 'card-1',
        content: '學習 useReducer',
        columnId: 'col-1', 
      },
      'card-2': {
        id: 'card-2',
        content: '建立 Trello Clone',
        columnId: 'col-1',
      },
      'card-3': {
        id: 'card-3',
        content: '精通 React',
        columnId: 'col-2',
      },
    },
    allIds: ['card-1', 'card-2', 'card-3'],
  },
}