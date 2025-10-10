import { useState, useEffect } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { addCard, generateCardId, deleteColumn, updateColumn, moveCard } from '../reducers/actions';
import { useBoardDispatch } from '../context/BoardContext';
import Card from './Card';

const confirmAction = (message) => window.confirm(message);

function Column({ columnId, column, cards, nextColumnId }) {
  const dispatch = useBoardDispatch();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(column.title);

  useEffect(() => {
    setEditedTitle(column.title);
  }, [column.title]);

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      const id = generateCardId();
      dispatch(addCard(id, columnId, newCardContent.trim()));
      setNewCardContent('');
      setIsAddingCard(false);
    }
  };

  const handleUpdateTitle = () => {
    if (editedTitle.trim() && editedTitle !== column.title) {
      dispatch(updateColumn(columnId, editedTitle.trim()));
    }
    setIsEditingTitle(false);
  };

  const handleDeleteColumn = () => {
    if (confirmAction(`確定要刪除「${column.title}」嗎？這會刪除所有卡片。`)) {
      dispatch(deleteColumn(columnId));
    }
  };

  // 移動卡片邏輯
  const handleMoveCardUp = (cardId, currentIndex) => {
    if (currentIndex > 0) {
      dispatch(moveCard(cardId, columnId, currentIndex - 1));
    }
  };

  const handleMoveCardDown = (cardId, currentIndex) => {
    if (currentIndex < cards.length - 1) {
      dispatch(moveCard(cardId, columnId, currentIndex + 1));
    }
  };

  const handleMoveCardToNext = (cardId) => {
    if (nextColumnId) {
      dispatch(moveCard(cardId, nextColumnId, 0));
    }
  };

  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  const cardIds = cards.map((card) => card.id);

  return (
    <div className="w-80 bg-gray-100 rounded-lg p-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleUpdateTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdateTitle();
              if (e.key === 'Escape') {
                setEditedTitle(column.title);
                setIsEditingTitle(false);
              }
            }}
            className="flex-1 px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          <h2
            className="text-lg font-semibold cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
            onClick={() => setIsEditingTitle(true)}
          >
            {column.title}
          </h2>
        )}

        <button
          onClick={handleDeleteColumn}
          className="text-red-500 hover:text-red-700 ml-2"
          title="刪除欄位"
        >
          🗑
        </button>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`space-y-2 mb-4 min-h-[100px] rounded p-2 transition-colors ${
            isOver ? 'bg-blue-50 ring-2 ring-blue-300' : ''
          }`}
        >
          {cards.length === 0 && (
            <div className="text-gray-400 text-center py-8 text-sm">
              {isOver ? '放開以加入卡片' : '拖曳卡片到這裡'}
            </div>
          )}
          {cards.map((card, index) => {
            if (!card?.id) {
              console.error('Card missing id:', card);
              return null;
            }

            return (
              <Card
                key={card.id}
                cardId={card.id}
                card={card}
                columnId={columnId}
                canMoveUp={index > 0}
                canMoveDown={index < cards.length - 1}
                canMoveNext={!!nextColumnId}
                onMoveUp={() => handleMoveCardUp(card.id, index)}
                onMoveDown={() => handleMoveCardDown(card.id, index)}
                onMoveNext={() => handleMoveCardToNext(card.id)}
              />
            );
          })}
        </div>
      </SortableContext>

      {isAddingCard ? (
        <div className="space-y-2">
          <textarea
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddCard();
              }
              if (e.key === 'Escape') {
                setNewCardContent('');
                setIsAddingCard(false);
              }
            }}
            placeholder="輸入卡片內容..."
            className="w-full px-3 py-2 border rounded resize-none"
            rows="3"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddCard}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              新增
            </button>
            <button
              onClick={() => {
                setNewCardContent('');
                setIsAddingCard(false);
              }}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="w-full px-3 py-2 text-left text-gray-600 hover:bg-gray-200 rounded"
        >
          + 新增卡片
        </button>
      )}
    </div>
  );
}

export default Column;
