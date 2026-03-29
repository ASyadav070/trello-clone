const cardService = require('../services/cardService');

const createCard = async (req, res, next) => {
  try {
    const newCard = await cardService.createCard(req.body);
    res.status(201).json(newCard);
  } catch (err) {
    next(err);
  }
};

const getCardById = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    next(err);
  }
};

const updateCard = async (req, res, next) => {
  try {
    const updatedCard = await cardService.updateCard(req.params.id, req.body);
    if (!updatedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(updatedCard);
  } catch (err) {
    next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await cardService.deleteCard(req.params.id);
    if (!deletedCard) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(deletedCard);
  } catch (err) {
    next(err);
  }
};

const reorderCard = async (req, res, next) => {
  try {
    const { cardId, sourceListId, destinationListId, newPosition } = req.body;
    const reorderedCard = await cardService.reorderCard(
      cardId,
      sourceListId,
      destinationListId,
      newPosition
    );
    res.json(reorderedCard);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  reorderCard
};
