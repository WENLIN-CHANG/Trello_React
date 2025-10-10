import { useState, useEffect } from 'react';
import { updateCard, deleteCard } from '../reducers/actions';
import { useBoardDispatch } from '../context/BoardContext';

const confirmAction = (message) => window.confirm(message);

function Card({
  cardId,
  card,
  columnId,
  canMoveUp,
  canMoveDown,
  canMoveNext,
  onMoveUp,
  onMoveDown,
  onMoveNext,
}) {
  const dispatch = useBoardDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(card.content);

  useEffect(() => {
    setEditedContent(card.content);
  }, [card.content]);

  const handleUpdate = () => {
    if (editedContent.trim() && editedContent !== card.content) {
      dispatch(updateCard(cardId, editedContent.trim()));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirmAction('確定要刪除這張卡片嗎？')) {
      dispatch(deleteCard(cardId));
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded shadow">
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          onBlur={handleUpdate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleUpdate();
            }
            if (e.key === 'Escape') {
              setEditedContent(card.content);
              setIsEditing(false);
            }
          }}
          className="w-full border rounded px-2 py-1 resize-none"
          rows="3"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-3 rounded shadow hover:shadow-md transition-shadow group">
      <p
        className="cursor-pointer mb-2"
        onClick={() => setIsEditing(true)}
      >
        {card.content}
      </p>

      <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
          title="往上移"
        >
          ↑
        </button>
        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
          title="往下移"
        >
          ↓
        </button>
        <button
          onClick={onMoveNext}
          disabled={!canMoveNext}
          className="px-2 py-1 text-sm bg-blue-200 rounded hover:bg-blue-300 disabled:opacity-30 disabled:cursor-not-allowed"
          title="移到下一欄"
        >
          →
        </button>
        <div className="flex-1"></div>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-red-500 hover:text-red-700"
          title="刪除"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Card;
