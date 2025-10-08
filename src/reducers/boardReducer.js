import { produce  } from "immer";
import { ActionTypes } from "./actions";

export const boardReducer = produce((draft, action) => {
  switch (action.type) {
    case ActionTypes.ADD_CARD: {
      const { id, columnId, content } = action.payload;

      // 錯誤處理：column 不存在
      if (!draft.columns.byId[columnId]) {
        console.error(`Column ${columnId} not found`);
        break;
      }

      draft.cards.byId[id] = {
        content,
        columnId
      }

      draft.cards.allIds.push(id);

      draft.columns.byId[columnId].cardIds.push(id)

      break;
    }

    case ActionTypes.UPDATE_CARD: {
      const { cardId, content } = action.payload;

      // 錯誤處理：card 不存在
      if (!draft.cards.byId[cardId]) {
        console.error(`Card ${cardId} not found`);
        break;
      }

      draft.cards.byId[cardId].content = content;

      break;
    }

    case ActionTypes.DELETE_CARD: {
      const { cardId } = action.payload;
      const card = draft.cards.byId[cardId];

      // 錯誤處理：card 不存在
      if (!card) {
        console.error(`Card ${cardId} not found`);
        break;
      }

      const columnId = card.columnId;

      // 從 column 的 cardIds 移除
      const column = draft.columns.byId[columnId];
      const cardIndex = column.cardIds.indexOf(cardId);
      if (cardIndex !== -1) {  // 確保找到了
        column.cardIds.splice(cardIndex, 1);
      }

      // 從 cards.byId 刪除
      delete draft.cards.byId[cardId];

      // 從 cards.allIds 移除
      const allIdsIndex = draft.cards.allIds.indexOf(cardId);
      if (allIdsIndex !== -1) {  // 確保找到了
        draft.cards.allIds.splice(allIdsIndex, 1);
      }

      break;
    }

    case ActionTypes.MOVE_CARD: {
      const { cardId, targetColumnId, targetIndex } = action.payload;
      const card = draft.cards.byId[cardId];

      // 錯誤處理：card 不存在
      if (!card) {
        console.error(`Card ${cardId} not found`);
        break;
      }

      // 錯誤處理：目標 column 不存在
      if (!draft.columns.byId[targetColumnId]) {
        console.error(`Target column ${targetColumnId} not found`);
        break;
      }

      const sourceColumnId = card.columnId;

      // 從原 column 移除
      const sourceColumn = draft.columns.byId[sourceColumnId];
      const sourceIndex = sourceColumn.cardIds.indexOf(cardId);
      if (sourceIndex !== -1) {
        sourceColumn.cardIds.splice(sourceIndex, 1);
      }

      // 加到目標 column（指定位置）
      const targetColumn = draft.columns.byId[targetColumnId];
      const safeIndex = Math.max(0, Math.min(targetIndex, targetColumn.cardIds.length));
      targetColumn.cardIds.splice(safeIndex, 0, cardId);

      // 更新 card 的 columnId
      card.columnId = targetColumnId;

      break;
    }

    case ActionTypes.ADD_COLUMN: {
      const { id, title } = action.payload;

      // 新增到 columns.byId
      draft.columns.byId[id] = {
        title,
        cardIds: [],
      };

      // 加到 columns.allIds
      draft.columns.allIds.push(id);

      break;
    }

    case ActionTypes.UPDATE_COLUMN: {
      const { columnId, title } = action.payload;

      // 錯誤處理：column 不存在
      if (!draft.columns.byId[columnId]) {
        console.error(`Column ${columnId} not found`);
        break;
      }

      // 直接修改 column 的 title
      draft.columns.byId[columnId].title = title;

      break;
    }

    case ActionTypes.DELETE_COLUMN: {
      const { columnId } = action.payload;
      const column = draft.columns.byId[columnId];

      // 錯誤處理：column 不存在
      if (!column) {
        console.error(`Column ${columnId} not found`);
        break;
      }

      // 刪除這個 column 裡的所有 cards
      column.cardIds.forEach(cardId => {
        delete draft.cards.byId[cardId];
        const allIdsIndex = draft.cards.allIds.indexOf(cardId);
        if (allIdsIndex !== -1) {
          draft.cards.allIds.splice(allIdsIndex, 1);
        }
      });

      // 從 columns.byId 刪除
      delete draft.columns.byId[columnId];

      // 從 columns.allIds 移除
      const allIdsIndex = draft.columns.allIds.indexOf(columnId);
      if (allIdsIndex !== -1) {
        draft.columns.allIds.splice(allIdsIndex, 1);
      }

      break;
    }

    case ActionTypes.MOVE_COLUMN: {
      const { columnId, targetIndex } = action.payload;

      // 錯誤處理：column 不存在
      if (!draft.columns.byId[columnId]) {
        console.error(`Column ${columnId} not found`);
        break;
      }

      // 從 allIds 移除
      const currentIndex = draft.columns.allIds.indexOf(columnId);
      if (currentIndex === -1) {
        console.error(`Column ${columnId} not in allIds`);
        break;
      }
      draft.columns.allIds.splice(currentIndex, 1);

      // 插入到目標位置（限制在有效範圍內）
      const safeIndex = Math.max(0, Math.min(targetIndex, draft.columns.allIds.length));
      draft.columns.allIds.splice(safeIndex, 0, columnId);

      break;
    }

    default:
      break;
  }
})