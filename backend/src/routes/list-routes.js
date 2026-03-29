const express = require("express");
const { z } = require("zod");
const listController = require("../controllers/listController");
const validateBody = require("../middleware/validateBody");

const router = express.Router();

const listCreateSchema = z.object({
  board_id: z.string().uuid("Invalid board ID"),
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  position: z
    .number()
    .int()
    .min(0, "Position must be a positive integer")
    .optional(),
});

const listUpdateSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(100, "Title too long")
      .optional(),
    position: z.number().int().min(0).optional(),
  })
  .refine((data) => data.title !== undefined || data.position !== undefined, {
    message: "Must provide at least title or position to update",
  });

const listReorderSchema = z.object({
  listId: z.string().uuid("Invalid list ID"),
  boardId: z.string().uuid("Invalid board ID"),
  newPosition: z.number().int().min(0, "Position must be a positive integer"),
});

router.post("/", validateBody(listCreateSchema), listController.createList);
router.patch(
  "/reorder",
  validateBody(listReorderSchema),
  listController.reorderList,
);
router.patch("/:id", validateBody(listUpdateSchema), listController.updateList);
router.delete("/:id", listController.deleteList);

module.exports = router;
