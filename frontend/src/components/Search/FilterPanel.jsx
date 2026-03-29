
import React, { useState } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { LABEL_COLORS } from '../../constants/LABEL_COLORS';
import styles from './FilterPanel.module.css';

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  
  const globalLabels = useBoardStore(state => state.globalLabels);
  const globalMembers = useBoardStore(state => state.globalMembers);
  const filters = useBoardStore(state => state.filters);
  const toggleFilterLabel = useBoardStore(state => state.toggleFilterLabel);
  const toggleFilterMember = useBoardStore(state => state.toggleFilterMember);
  const clearFilters = useBoardStore(state => state.clearFilters);

  const isActiveFilters = filters.labels.length > 0 || filters.members.length > 0;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getColor = (id) => {
    const keys = Object.values(LABEL_COLORS);
    return keys[id.charCodeAt(id.length - 1) % keys.length];
  };

  return (
    <div className={styles.container}>
      <button 
        className={`${styles.filterBtn} ${isActiveFilters ? styles.active : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ fontSize: '12px' }}>▼</span> Filters {isActiveFilters && `(${filters.labels.length + filters.members.length})`}
      </button>

      {isOpen && (
        <>
          <div className={styles.popoverOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.popoverMenu}>
            <div className={styles.popoverHeader}>
              <span>Filter Cards</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            
            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Labels</div>
              {globalLabels.map(label => (
                <label key={label.id} className={styles.optionRow}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox}
                    checked={filters.labels.includes(label.id)}
                    onChange={() => toggleFilterLabel(label.id)}
                  />
                  <div className={styles.colorBlock} style={{ backgroundColor: LABEL_COLORS[label.color] || LABEL_COLORS.blue }}>
                    {label.name}
                  </div>
                </label>
              ))}
            </div>

            <div className={styles.filterSection}>
              <div className={styles.sectionTitle}>Members</div>
              {globalMembers.map(member => (
                <label key={member.id} className={styles.optionRow}>
                  <input 
                    type="checkbox" 
                    className={styles.checkbox}
                    checked={filters.members.includes(member.id)}
                    onChange={() => toggleFilterMember(member.id)}
                  />
                  <div className={styles.avatar} style={{ backgroundColor: getColor(member.id) }}>
                    {getInitials(member.name)}
                  </div>
                  <span className={styles.memberName}>{member.name}</span>
                </label>
              ))}
            </div>

            {isActiveFilters && (
              <div className={styles.clearRow}>
                <button className={styles.clearBtn} onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
