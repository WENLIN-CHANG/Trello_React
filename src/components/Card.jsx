import { useState, useEffect } from 'react';
import { updateCard, deleteCard } from '../reducers/actions';
import { useBoardDispatch } from '../context/BoardContext';

const confirmAction = (message) => window.confirm(message);

function Card({ cardId, card, columnId }) {
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
      <div className="flex items-start justify-between gap-2">
        <p
          className="flex-1 cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {card.content}
        </p>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
          title="刪除"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default Card;
