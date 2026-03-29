const cardRepository = require('../repositories/cardRepository');

const createCard = async (data) => {
  return cardRepository.create(data);
};

const getCardById = async (id) => {
  return cardRepository.findById(id);
};

const updateCard = async (id, data) => {
  return cardRepository.update(id, data);
};

const deleteCard = async (id) => {
  return cardRepository.remove(id);
};

const reorderCard = async (cardId, sourceListId, destinationListId, newPosition) => {
  // Pass the DND coordinates straight to the repo to execute as one safe transaction
  return cardRepository.reorder(cardId, sourceListId, destinationListId, newPosition);
};

module.exports = {
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  reorderCard
};
