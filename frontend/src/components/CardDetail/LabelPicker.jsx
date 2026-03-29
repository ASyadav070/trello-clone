
import React, { useState } from 'react';
import useBoardStore from '../../store/useBoardStore';
import { attachLabel, removeLabel } from '../../services/labelService';
import { LABEL_COLORS } from '../../constants/LABEL_COLORS';
import styles from './LabelPicker.module.css';

export default function LabelPicker({ card }) {
  const [isOpen, setIsOpen] = useState(false);
  const globalLabels = useBoardStore(state => state.globalLabels);
  const toggleCardLabel = useBoardStore(state => state.toggleCardLabel);

  const handleToggle = async (label) => {
    const isAttached = card.labels?.some(l => l.id === label.id);
    
    // Optimistic Update mutating securely mapped properties natively
    toggleCardLabel(card.id, label);

    try {
      if (isAttached) {
        await removeLabel(card.id, label.id);
      } else {
        await attachLabel(card.id, label.id);
      }
    } catch (err) {
      // Revert upon API boundary block intelligently
      toggleCardLabel(card.id, label);
      alert('Failed to sync label assignment to server.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Existing Labels Display strictly inline */}
      <h3 className={styles.sectionHeader}>Labels</h3>
      <div className={styles.attachedLabels}>
        {card.labels?.map((lbl) => (
          <div 
            key={lbl.id} 
            className={styles.labelChip}
            style={{ backgroundColor: LABEL_COLORS[lbl.color] || LABEL_COLORS.blue }}
          >
            {lbl.name}
          </div>
        ))}
        <button className={styles.addButton} onClick={() => setIsOpen(!isOpen)}>
          +
        </button>
      </div>

      {/* Selector Popover Dropdown securely blocking background maps */}
      {isOpen && (
        <>
          <div className={styles.popoverOverlay} onClick={() => setIsOpen(false)} />
          <div className={styles.popoverMenu}>
            <div className={styles.popoverHeader}>
              <span>Labels</span>
              <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <div className={styles.labelsList}>
              {globalLabels.map(label => {
                const isActive = card.labels?.some(l => l.id === label.id);
                return (
                  <div 
                    key={label.id} 
                    className={styles.labelOption}
                    onClick={() => handleToggle(label)}
                  >
                    <div 
                      className={styles.colorBlock}
                      style={{ backgroundColor: LABEL_COLORS[label.color] || LABEL_COLORS.blue }}
                    >
                      {label.name}
                    </div>
                    {isActive && <span className={styles.checkIcon}>✓</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
