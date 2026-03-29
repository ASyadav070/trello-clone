const checklistService = require('../services/checklistService');

const createItem = async (req, res, next) => {
  try {
    const { id: cardId } = req.params;
    const { title } = req.body;
    const newItem = await checklistService.createChecklistItem(cardId, title);
    res.status(201).json(newItem);
  } catch (err) { next(err); }
};

const updateItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const updatedItem = await checklistService.updateChecklistItem(itemId, req.body);
    if (!updatedItem) return res.status(404).json({ error: 'Checklist item not found' });
    res.json(updatedItem);
  } catch (err) { next(err); }
};

const removeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const deletedItem = await checklistService.deleteChecklistItem(itemId);
    if (!deletedItem) return res.status(404).json({ error: 'Checklist item not found' });
    res.json(deletedItem);
  } catch (err) { next(err); }
};

module.exports = { createItem, updateItem, removeItem };
