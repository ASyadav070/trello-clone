const boardService = require('../services/boardService');

const getAllBoards = async (req, res, next) => {
  try {
    const boards = await boardService.getAllBoards();
    res.json(boards);
  } catch (err) {
    next(err);
  }
};

const getBoardById = async (req, res, next) => {
  try {
    const board = await boardService.getBoardById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }
    res.json(board);
  } catch (err) {
    next(err);
  }
};

const createBoard = async (req, res, next) => {
  try {
    const newBoard = await boardService.createBoard(req.body);
    res.status(201).json(newBoard);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllBoards,
  getBoardById,
  createBoard
};
