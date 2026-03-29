import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useBoardStore from '../../store/useBoardStore';
import ListColumn from '../List/ListColumn';
import AddListButton from '../List/AddListButton';
import styles from './BoardCanvas.module.css';
import useDragDrop from '../../hooks/useDragDrop';

export default function BoardCanvas() {
  const { lists, activeBoard } = useBoardStore();
  
  // Custom Optimistic execution handling rollback promises seamlessly
  const { handleDragEnd } = useDragDrop();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board_container" direction="horizontal" type="LIST">
        {(provided) => (
          <div 
            className={styles.canvas}
            ref={provided.innerRef} 
            {...provided.droppableProps}
          >
            {lists.map((list, index) => (
              <Draggable key={list.id} draggableId={list.id} index={index} type="LIST">
                {(provided) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.draggableProps}
                  >
                    <ListColumn 
                      list={list} 
                      dragHandleProps={provided.dragHandleProps} 
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <AddListButton boardId={activeBoard.id} />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
