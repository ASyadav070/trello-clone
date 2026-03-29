
import React, { useState, useEffect } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { updateCard } from '../../services/cardService';
import styles from './CardDescription.module.css';

export default function CardDescription({ card }) {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(card.description || "");
  const updateCardData = useBoardStore(state => state.updateCardData);

  // Sync prop changes organically avoiding stale scopes if drag handles overlap states
  useEffect(() => {
    setDesc(card.description || "");
  }, [card.description]);

  const handleSave = async () => {
    const previousDesc = card.description;
    
    // Optimistic UI slice operation triggered gracefully
    updateCardData(card.id, { description: desc });
    setIsEditing(false);

    try {
      await updateCard(card.id, { description: desc });
    } catch (error) {
      console.error('Failed to update description:', error);
      // Native Rollback
      updateCardData(card.id, { description: previousDesc });
      alert("Failed to save the description locally. Data connection interrupted.");
    }
  };

  const handleCancel = () => {
    setDesc(card.description || "");
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Description</div>
      
      {isEditing ? (
        <div className={styles.editArea}>
          <textarea 
            className={styles.textarea}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Add a more detailed description..."
            autoFocus
          />
          <div className={styles.actions}>
            <button className={styles.saveButton} onClick={handleSave}>Save</button>
            <button className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <div 
          className={`${styles.displayArea} ${!desc ? styles.emptyText : ''}`}
          onClick={() => setIsEditing(true)}
        >
          {desc || "Add a more detailed description..."}
        </div>
      )}
    </div>
  );
}
