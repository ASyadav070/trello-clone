
import React, { useState, useRef, useEffect } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { createList } from '../../services/listService';
import styles from './AddListButton.module.css';

export default function AddListButton({ boardId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef(null);

  const { addList, replaceListTempId, removeList } = useBoardStore();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    // Isolate Local State mapping directly closing component safely bounding multiple rapid hits natively
    setIsEditing(false);
    setTitle('');

    const tempId = `temp-list-${Date.now()}`;
    const newList = {
      id: tempId,
      board_id: boardId,
      title: cleanTitle,
      position: 999999, // Backend mathematically assigns position safely, using large float forces to end
    };

    // Optimistic Layout
    addList(newList);

    try {
      const savedList = await createList({
        board_id: boardId,
        title: cleanTitle
      });
      replaceListTempId(tempId, savedList);
    } catch (err) {
      removeList(tempId);
      alert('Failed to construct the list securely upon the network layer.');
    }
  };

  if (!isEditing) {
    return (
      <div className={styles.container}>
        <button className={styles.button} onClick={() => setIsEditing(true)}>
          + Add another list
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input 
          ref={inputRef}
          className={styles.input}
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setIsEditing(false);
          }}
        />
        <div className={styles.controls}>
          <button type="submit" className={styles.addBtn}>Add list</button>
          <button type="button" className={styles.cancelBtn} onClick={() => setIsEditing(false)}>
            &times;
          </button>
        </div>
      </form>
    </div>
  );
}
