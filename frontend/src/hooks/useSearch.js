
import { useMemo } from 'react';
import useBoardStore from '../store/useBoardStore';

export default function useFilteredCards(listId) {
  const rawCards = useBoardStore(state => state.cards[listId] || []);
  const searchQuery = useBoardStore(state => state.searchQuery);
  const filters = useBoardStore(state => state.filters);

  // Derive isolated UI representations preventing state mutation directly
  return useMemo(() => {
    if (!searchQuery && filters.labels.length === 0 && filters.members.length === 0) {
      return rawCards;
    }

    const queryLower = searchQuery.toLowerCase();

    return rawCards.filter(card => {
      // 1. Text Title Interrogation (ILIKE format checking inherently)
      const matchesTitle = !searchQuery || card.title.toLowerCase().includes(queryLower);
      if (!matchesTitle) return false;

      // 2. Labels Checking (Strict AND matching all requested array filters natively)
      const hasLabelsFilter = filters.labels.length > 0;
      const matchesLabels = !hasLabelsFilter || 
        (card.labels && filters.labels.every(filterId => card.labels.some(label => label.id === filterId)));
      if (!matchesLabels) return false;

      // 3. Members Interrogation (Strict AND natively asserting presence directly)
      const hasMembersFilter = filters.members.length > 0;
      const matchesMembers = !hasMembersFilter || 
        (card.members && filters.members.every(filterId => card.members.some(member => member.id === filterId)));
      if (!matchesMembers) return false;

      return true; // AND concatenation securely validates successfully mapped fields matching perfectly
    });
  }, [rawCards, searchQuery, filters.labels, filters.members]);
}
