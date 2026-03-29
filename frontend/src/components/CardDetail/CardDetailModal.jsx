
import React from 'react';
import useBoardStore from '../../store/useBoardStore';
import CardTitle from './CardTitle';
import CardDescription from './CardDescription';
import LabelPicker from './LabelPicker';
import MemberAssigner from './MemberAssigner';
import ChecklistSection from './ChecklistSection';
import styles from './CardDetailModal.module.css';

export default function CardDetailModal() {
  const activeCardId = useBoardStore(state => state.activeCardId);
  const cardsDict = useBoardStore(state => state.cards);
  const closeCardModal = useBoardStore(state => state.closeCardModal);

  if (!activeCardId) return null;

  // Retrieve explicitly requested Option A resolution mapping dictionary lookups dynamically
  const activeCard = Object.values(cardsDict).flat().find(c => c.id === activeCardId);

  // Fallback safely if array strips dynamically
  if (!activeCard) return null;

  return (
    <div className={styles.backdrop} onClick={closeCardModal}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()} // Stop background mapping from triggering accidentally inside
      >
        <button className={styles.closeButton} onClick={closeCardModal}>
          &times;
        </button>

        <CardTitle card={activeCard} />

        <div className={styles.mainLayout}>
          {/* Main Content Column */}
          <div className={styles.contentColumn}>
            <CardDescription card={activeCard} />
            {/* Interactive Components Replaced Placeholders */}
            <ChecklistSection card={activeCard} />
          </div>

          {/* Setup sidebar configuration holding Actions sequentially */}
          <div className={styles.sidebarColumn}>
             <MemberAssigner card={activeCard} />
             <LabelPicker card={activeCard} />
          </div>
        </div>
      </div>
    </div>
  );
}
