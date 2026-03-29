
import React, { useState, useEffect } from 'react';
import useBoardStore from '../../store/useBoardStore';
import useDebounce from '../../hooks/useDebounce';
import styles from './SearchBar.module.css';

export default function SearchBar() {
  const [localQuery, setLocalQuery] = useState('');
  const debouncedQuery = useDebounce(localQuery, 300);
  const setSearchQuery = useBoardStore(state => state.setSearchQuery);

  // Sync debounced output explicitly mapping to the global Zustand cache natively.
  useEffect(() => {
    setSearchQuery(debouncedQuery);
  }, [debouncedQuery, setSearchQuery]);

  return (
    <div className={styles.container}>
      <input 
        type="text" 
        className={styles.input}
        placeholder="Search cards..." 
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
      />
      {/* Search Magnifying Glass Scaffold Icon */}
      <span className={styles.icon}>🔍</span>
    </div>
  );
}
