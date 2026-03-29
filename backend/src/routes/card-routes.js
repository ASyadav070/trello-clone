const express = require('express');
const { z } = require('zod');
const cardController = require('../controllers/cardController');
const labelController = require('../controllers/labelController');
const memberController = require('../controllers/memberController');
const checklistController = require('../controllers/checklistController');
const validateBody = require('../middleware/validateBody');

const router = express.Router();

const cardCreateSchema = z.object({
  list_id: z.string().uuid('Invalid list ID'),
  title: z.string().min(1, 'Title is required').max(255, 'Title too long')
});

const cardUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  due_date: z.string().datetime().optional().nullable(),
  is_archived: z.boolean().optional(),
  cover_image: z.string().url().optional().nullable()
});

const cardReorderSchema = z.object({
  cardId: z.string().uuid('Invalid card ID'),
  sourceListId: z.string().uuid('Invalid source list ID'),
  destinationListId: z.string().uuid('Invalid destination list ID'),
  newPosition: z.number().int().min(0, 'Position must be a positive integer')
});

const cardLabelSchema = z.object({
  labelId: z.string().uuid('Invalid label ID')
});

const cardMemberSchema = z.object({
  memberId: z.string().uuid('Invalid member ID')
});

const checklistCreateSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200, 'Title too long')
});


router.post('/', validateBody(cardCreateSchema), cardController.createCard);
router.get('/:id', cardController.getCardById);
router.patch('/reorder', validateBody(cardReorderSchema), cardController.reorderCard);
router.patch('/:id', validateBody(cardUpdateSchema), cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

// Extensions Mapping
router.post('/:id/labels', validateBody(cardLabelSchema), labelController.attachLabel);
router.delete('/:id/labels/:labelId', labelController.removeLabel);

router.post('/:id/members', validateBody(cardMemberSchema), memberController.assignMember);
router.delete('/:id/members/:memberId', memberController.unassignMember);

router.post('/:id/checklist', validateBody(checklistCreateSchema), checklistController.createItem);

module.exports = router;
