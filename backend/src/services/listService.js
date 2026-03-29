const listRepository = require('../repositories/listRepository');

const createList = async (data) => {
  return listRepository.create(data);
};

const updateList = async (id, data) => {
  return listRepository.update(id, data);
};

const deleteList = async (id) => {
  return listRepository.remove(id);
};

const reorderList = async (listId, boardId, newPosition) => {
  return listRepository.reorder(listId, boardId, newPosition);
};

module.exports = {
  createList,
  updateList,
  deleteList,
  reorderList
};
