
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import useBoardStore from '../../store/useBoardStore';
import CardLabels from './CardLabels';
import CardMeta from './CardMeta';
import styles from './CardItem.module.css';

export default function CardItem({ card, index }) {
  const openCardModal = useBoardStore(state => state.openCardModal);
  return (
    <Draggable draggableId={card.id} index={index} type="CARD">
      {(provided, snapshot) => (
        <div
          className={styles.card}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            /* Dynamic override simulating grab effect natively during active drags */
            boxShadow: snapshot.isDragging ? '0 8px 16px rgba(0,0,0,0.2)' : undefined,
            cursor: snapshot.isDragging ? 'grabbing' : 'pointer', // Override default grab since this is highly clickable now
          }}
          onClick={() => openCardModal(card.id)}
        >
          <CardLabels labels={card.labels} />
          <span className={styles.cardTitle}>{card.title}</span>
          <CardMeta card={card} />
          
          {/* Subtle placeholder pencil icon mirroring standard Trello interactions */}
          <span className={styles.editIcon} onClick={(e) => {
            e.stopPropagation(); // Avoid triggering card-click later
            console.log('Edit icon clicked for card:', card.id);
          }}>
            ✎
          </span>
        </div>
      )}
    </Draggable>
  );
}
