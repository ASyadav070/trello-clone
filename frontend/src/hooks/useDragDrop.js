import { reorderCard } from '../services/cardService';
import { reorderLists } from '../services/listService';
import useBoardStore from '../store/useBoardStore';

export default function useDragDrop() {
  const { moveList, moveCard, lists, cards, setLists, setCards } = useBoardStore();

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    // Check bounds dropping outside active boxes
    if (!destination) return;
    
    // Check meaningless isolated drops
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    if (type === 'LIST') {
      const prevLists = [...lists]; // Snapshot for optimistic rollback
      const boardId = prevLists[source.index]?.board_id;

      // Ensure immediate UX perception shift bounds directly bypassing wait promises
      moveList(source.index, destination.index);

      try {
        await reorderLists({ 
          listId: draggableId, 
          boardId, 
          newPosition: destination.index // Relying intrinsically on the payload transaction logic implemented Step 7 
        });
      } catch (error) {
        console.error('List Sync Error:', error);
        setLists(prevLists);
        // Fallback alert logic as standard practice if toast is not implicitly wired
        alert(error?.message || 'Failed to sync List order to server.');
      }
      return;
    }

    if (type === 'CARD') {
      // Optimistic rendering natively
      moveCard(draggableId, source, destination);

      try {
        await reorderCard({
          cardId: draggableId,
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
          newPosition: destination.index
        });
      } catch (error) {
        console.error('Card Sync Error:', error);
        // Inverse rollback preventing catastrophic data loss of items created during flight
        moveCard(draggableId, destination, source);
        alert(error?.message || 'Server rejected card shift. Reverting.');
      }
      return;
    }
  };

  return { handleDragEnd };
}
