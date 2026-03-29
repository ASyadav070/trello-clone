
import React from 'react';
import useBoardStore from '../../store/useBoardStore';
import { updateChecklistItem, removeChecklistItem } from '../../services/checklistService';
import styles from './Checklist.module.css';

export default function ChecklistItem({ item, cardId }) {
  const updateCardChecklistItem = useBoardStore(state => state.updateCardChecklistItem);
  const removeCardChecklistItem = useBoardStore(state => state.removeCardChecklistItem);

  const handleToggle = async () => {
    const newStatus = !item.is_complete;
    // Optimistic completion
    updateCardChecklistItem(cardId, item.id, { is_complete: newStatus });

    try {
      await updateChecklistItem(item.id, { is_complete: newStatus });
    } catch (err) {
      // Rollback
      updateCardChecklistItem(cardId, item.id, { is_complete: item.is_complete });
      alert('Failed to sync checklist toggle with server.');
    }
  };

  const handleDelete = async () => {
    // Snapshot
    const backupItem = { ...item };
    
    // Optimistic Remove
    removeCardChecklistItem(cardId, item.id);

    try {
      await removeChecklistItem(item.id);
    } catch (err) {
      // Re-insert is heavy in this local state map, so we'll fallback to alerting gracefully
      // Re-inserting reliably would require `addCardChecklistItem(cardId, backupItem)`
      useBoardStore.getState().addCardChecklistItem(cardId, backupItem);
      alert('Failed to delete checklist node natively.');
    }
  };

  return (
    <div className={styles.itemRow}>
      <input 
        type="checkbox" 
        className={styles.checkbox}
        checked={item.is_complete}
        onChange={handleToggle}
      />
      <div className={`${styles.itemTitle} ${item.is_complete ? styles.checked : ''}`}>
        {item.title}
      </div>
      <button className={styles.deleteButton} onClick={handleDelete} title="Delete Item">
        &times;
      </button>
    </div>
  );
}
