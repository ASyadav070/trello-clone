
import React from 'react';
import { LABEL_COLORS } from '../../constants/LABEL_COLORS';
import styles from './CardLabels.module.css';

export default function CardLabels({ labels }) {
  if (!labels || labels.length === 0) return null;

  return (
    <div className={styles.container}>
      {labels.map(label => (
        <div 
          key={label.id} 
          className={styles.labelChip}
          style={{ backgroundColor: LABEL_COLORS[label.color] || LABEL_COLORS.blue }}
          title={label.name}
        />
      ))}
    </div>
  );
}
