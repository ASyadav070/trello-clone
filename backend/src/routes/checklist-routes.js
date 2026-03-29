const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');
const validateBody = require('../middleware/validateBody');
const { z } = require('zod');

const checklistUpdateSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200, 'Title too long').optional(),
  is_complete: z.boolean().optional()
}).refine(data => data.title !== undefined || data.is_complete !== undefined, {
  message: 'Must provide title or is_complete'
});

router.patch('/:itemId', validateBody(checklistUpdateSchema), checklistController.updateItem);
router.delete('/:itemId', checklistController.removeItem);

module.exports = router;
