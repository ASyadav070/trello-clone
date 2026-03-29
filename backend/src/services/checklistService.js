const checklistRepository = require('../repositories/checklistRepository');

const createChecklistItem = (cardId, title) => checklistRepository.create(cardId, title);
const updateChecklistItem = (itemId, payload) => checklistRepository.update(itemId, payload);
const deleteChecklistItem = (itemId) => checklistRepository.remove(itemId);

module.exports = { createChecklistItem, updateChecklistItem, deleteChecklistItem };
