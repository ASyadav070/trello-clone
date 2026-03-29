
import React, { useState, useRef, useEffect } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { createCard } from '../../services/cardService';
import styles from './AddCardButton.module.css';

export default function AddCardButton({ listId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const textareaRef = useRef(null);

  const { addCard, replaceCardTempId, removeCard } = useBoardStore();

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      textareaRef.current?.focus(); // Snap focus back if empty submit
      return; 
    }

    // Keep the UI open seamlessly allowing rapid typing natively
    setTitle('');
    
    // Autofocus explicitly avoiding event blur jumps
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);

    const tempId = `temp-card-${Date.now()}`;
    const newCard = {
      id: tempId,
      list_id: listId,
      title: cleanTitle,
      position: 999999, // Safely pushed until backend generates native UUID positions
      labels: [],
      members: [],
      checklists: []
    };

    // Optimistic UI placement
    addCard(listId, newCard);

    try {
      const savedCard = await createCard({ list_id: listId, title: cleanTitle });
      replaceCardTempId(listId, tempId, savedCard);
    } catch (err) {
      removeCard(listId, tempId);
      alert('Network constraint blocked Card assignment.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent explicitly adding native `\n` linebreaks before validating successfully
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setTitle('');
    }
  };

  if (!isEditing) {
    return (
      <button className={styles.triggerButton} onClick={() => setIsEditing(true)}>
        <span className={styles.plusIcon}>+</span> Add a card
      </button>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <textarea 
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Enter a title for this card..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <div className={styles.controls}>
          <button type="submit" className={styles.addBtn}>Add card</button>
          <button type="button" className={styles.cancelBtn} onClick={() => { setIsEditing(false); setTitle(''); }}>
            &times;
          </button>
        </div>
      </form>
    </div>
  );
}
