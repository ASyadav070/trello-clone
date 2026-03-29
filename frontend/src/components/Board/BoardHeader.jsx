
import React from 'react';
import useBoardStore from '../../store/useBoardStore';
import SearchBar from '../Search/SearchBar';
import FilterPanel from '../Search/FilterPanel';
import styles from './BoardHeader.module.css';

export default function BoardHeader() {
  const activeBoard = useBoardStore(state => state.activeBoard);

  if (!activeBoard) return null;

  return (
    <header className={styles.header}>
      <h2 className={styles.title}>{activeBoard.title}</h2>
      <div className={styles.rightControls}>
        <FilterPanel />
        <SearchBar />
      </div>
    </header>
  );
}
