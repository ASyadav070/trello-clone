const express = require('express');
const { z } = require('zod');
const boardController = require('../controllers/boardController');
const validateBody = require('../middleware/validateBody');

const router = express.Router();

const boardCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  background: z.string().optional()
});

router.get('/', boardController.getAllBoards);
router.get('/:id', boardController.getBoardById);
router.post('/', validateBody(boardCreateSchema), boardController.createBoard);

module.exports = router;
