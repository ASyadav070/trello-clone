
import React, { useState, useEffect } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { updateCard } from '../../services/cardService';
import styles from './CardTitle.module.css';

export default function CardTitle({ card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title || "");
  const updateCardData = useBoardStore(state => state.updateCardData);

  // Sync internal state natively mapping to external parent updates dynamically
  useEffect(() => {
    setTitle(card.title);
  }, [card.title]);

  const handleSave = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === card.title) {
      setIsEditing(false);
      setTitle(card.title); // Reset invalid blanks
      return;
    }

    // 1. Snapshot for pristine API hydration
    const previousTitle = card.title;

    // 2. Optimistic Context UI substitution immediately updating
    updateCardData(card.id, { title: trimmed });
    setIsEditing(false);

    // 3. Axios persistence layer
    try {
      await updateCard(card.id, { title: trimmed });
    } catch (error) {
      console.error('Failed to update title:', error);
      updateCardData(card.id, { title: previousTitle }); // Rollback UI if db declines
      alert("Failed to save the new title layout locally.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <input 
          className={styles.titleInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div 
          className={styles.titleDisplay} 
          onClick={() => setIsEditing(true)}
        >
          {title}
        </div>
      )}
    </div>
  );
}
