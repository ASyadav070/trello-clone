
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import useFilteredCards from '../../hooks/useSearch';
import CardItem from '../Card/CardItem';
import AddCardButton from '../Card/AddCardButton';
import styles from './ListColumn.module.css';

export default function ListColumn({ list, dragHandleProps }) {
  // Extract securely the filtered mapping bypassing massive generic array renders organically
  const cards = useFilteredCards(list.id);

  return (
    <div className={styles.column}>
      {/* List Header acts as the handle for dragging the whole list */}
      <div className={styles.header} {...dragHandleProps}>
        {list.title}
      </div>

      <Droppable droppableId={list.id} type="CARD">
        {(provided) => (
          <div 
            className={styles.cardContainer}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <CardItem key={card.id} card={card} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Mount contextual generation blocks cleanly rendering internally without affecting Droppable heights implicitly */}
      <AddCardButton listId={list.id} />
    </div>
  );
}
