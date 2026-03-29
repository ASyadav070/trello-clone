const listService = require('../services/listService');

const createList = async (req, res, next) => {
  try {
    const newList = await listService.createList(req.body);
    res.status(201).json(newList);
  } catch (err) {
    next(err);
  }
};

const updateList = async (req, res, next) => {
  try {
    const updatedList = await listService.updateList(req.params.id, req.body);
    if (!updatedList) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(updatedList);
  } catch (err) {
    next(err);
  }
};

const deleteList = async (req, res, next) => {
  try {
    const deletedList = await listService.deleteList(req.params.id);
    if (!deletedList) {
      return res.status(404).json({ error: 'List not found' });
    }
    res.json(deletedList);
  } catch (err) {
    next(err);
  }
};

const reorderList = async (req, res, next) => {
  try {
    const { listId, boardId, newPosition } = req.body;
    const reorderedList = await listService.reorderList(listId, boardId, newPosition);
    res.json(reorderedList);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createList,
  updateList,
  deleteList,
  reorderList
};
