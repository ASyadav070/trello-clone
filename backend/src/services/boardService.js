const boardRepository = require('../repositories/boardRepository');

const getAllBoards = async () => {
  return boardRepository.findAll();
};

const getBoardById = async (id) => {
  return boardRepository.findById(id);
};

const createBoard = async (data) => {
  return boardRepository.create(data);
};

module.exports = {
  getAllBoards,
  getBoardById,
  createBoard
};
