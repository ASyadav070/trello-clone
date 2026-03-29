
import React from 'react';
import { LABEL_COLORS } from '../../constants/LABEL_COLORS';
import styles from './CardMeta.module.css';

export default function CardMeta({ card }) {
  // Extract Metadata Presence ensuring no partial empty render wrappers map natively
  const hasDueDate = !!card.due_date;
  const hasChecklist = card.checklists && card.checklists.length > 0;
  const hasMembers = card.members && card.members.length > 0;

  if (!hasDueDate && !hasChecklist && !hasMembers) return null;

  // Resolve calculations
  const isOverdue = hasDueDate && new Date(card.due_date) < new Date();
  const completedChecklistCount = hasChecklist ? card.checklists.filter(c => c.is_complete).length : 0;
  const totalChecklistCount = hasChecklist ? card.checklists.length : 0;

  const formattedDate = hasDueDate ? new Date(card.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';

  // Avatar utility mappers securely caching identical hashing limits dynamically 
  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getColor = (id) => {
    const keys = Object.values(LABEL_COLORS);
    return keys[id.charCodeAt(id.length - 1) % keys.length];
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftMeta}>
        {hasDueDate && (
          <div className={`${styles.badge} ${isOverdue ? styles.overdue : ''}`} title="Due Date">
            🕒 {formattedDate}
          </div>
        )}
        
        {hasChecklist && (
          <div className={`${styles.badge} ${completedChecklistCount === totalChecklistCount ? styles.complete : ''}`} title="Checklist items">
            ☑️ {completedChecklistCount}/{totalChecklistCount}
          </div>
        )}
      </div>

      {hasMembers && (
        <div className={styles.rightMeta}>
          {card.members.map(member => (
            <div 
              key={member.id} 
              className={styles.avatar} 
              style={{ backgroundColor: getColor(member.id), zIndex: 1 }}
              title={member.name}
            >
              {getInitials(member.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
