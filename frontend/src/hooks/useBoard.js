import { useState, useEffect } from 'react';
import { getBoardById } from '../services/boardService';
import { getAllLabels } from '../services/labelService';
import { getAllMembers } from '../services/memberService';
import useBoardStore from '../store/useBoardStore';

export default function useBoard(boardId) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { setActiveBoard, setLists, setCards, setGlobalLabels, setGlobalMembers } = useBoardStore();

  useEffect(() => {
    if (!boardId) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const fetchBoardData = async () => {
      try {
        const [boardData, labelsData, membersData] = await Promise.all([
          getBoardById(boardId),
          getAllLabels(),
          getAllMembers()
        ]);
        
        if (isMounted && boardData) {
          // Flatten nested payloads for optimal Zustand mapped access
          const listsArray = [];
          
          boardData.lists?.forEach(list => {
            const { cards, ...listMeta } = list;
            listsArray.push(listMeta);
            // Hydrate the localized list dictionary seamlessly
            setCards(listMeta.id, cards || []);
          });

          // Mount lists framework
          setLists(listsArray);
          
          // Omit the heavily nested array before saving as the single active board reference
          const { lists, ...boardMeta } = boardData;
          setActiveBoard(boardMeta);

          // Instantiate explicit globals securely
          if (labelsData) setGlobalLabels(labelsData);
          if (membersData) setGlobalMembers(membersData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to connect to the backend server.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchBoardData();

    return () => {
      isMounted = false; // Prevent async memory leaks
    };
  }, [boardId, setActiveBoard, setLists, setCards]);

  return { isLoading, error };
}
