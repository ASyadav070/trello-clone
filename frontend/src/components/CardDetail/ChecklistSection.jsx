
import React, { useState } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { addChecklistItem } from '../../services/checklistService';
import ChecklistItem from './ChecklistItem';
import styles from './Checklist.module.css';

export default function ChecklistSection({ card }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const addCardChecklistItem = useBoardStore(state => state.addCardChecklistItem);

  const items = card.checklists || [];
  const completedCount = items.filter(i => i.is_complete).length;
  const progressPercent = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

  const handleAdd = async (e) => {
    e.preventDefault();
    const title = newItemTitle.trim();
    if (!title) return;

    // We CANNOT strictly optimize insertions visually immediately because Checklist items require a Database UUID.
    // We will await the minimal insert to retrieve the ID, preventing UI desync if users mash checkboxes.
    setNewItemTitle('');
    setIsAdding(false);

    try {
      const savedItem = await addChecklistItem(card.id, title);
      addCardChecklistItem(card.id, savedItem);
    } catch (err) {
      alert('Failed to append checklist item to network.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Header and Progress Display */}
      <div className={styles.header}>Checklist</div>
      
      <div className={styles.progressWrapper}>
        <span className={styles.percentageNum}>{progressPercent}%</span>
        <div className={styles.progressBarTrack}>
          <div 
            className={`${styles.progressBarFill} ${progressPercent === 100 ? styles.complete : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Rows */}
      <div className={styles.itemsList}>
        {items.map(item => (
          <ChecklistItem key={item.id} item={item} cardId={card.id} />
        ))}
      </div>

      {/* Add New Item Appendage Form */}
      {isAdding ? (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <input 
            type="text"
            autoFocus
            className={styles.addInput}
            placeholder="Add an item..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
          />
          <div className={styles.addButtonGroup}>
            <button type="submit" className={styles.saveButton}>Add</button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={() => { setIsAdding(false); setNewItemTitle(''); }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button className={styles.triggerButton} onClick={() => setIsAdding(true)}>
          Add an item
        </button>
      )}
    </div>
  );
}
