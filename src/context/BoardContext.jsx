import { createContext, useContext } from 'react';

const BoardDispatchContext = createContext(null);

export function BoardProvider({ dispatch, children }) {
  return (
    <BoardDispatchContext.Provider value={dispatch}>
      {children}
    </BoardDispatchContext.Provider>
  );
}

export function useBoardDispatch() {
  const dispatch = useContext(BoardDispatchContext);
  if (!dispatch) {
    throw new Error('useBoardDispatch must be used within BoardProvider');
  }
  return dispatch;
}
