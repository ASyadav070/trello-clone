const labelService = require('../services/labelService');

const getAllLabels = async (req, res, next) => {
  try {
    const labels = await labelService.getAllLabels();
    res.json(labels);
  } catch (err) { next(err); }
};

const attachLabel = async (req, res, next) => {
  try {
    const { id: cardId } = req.params;
    const { labelId } = req.body;
    await labelService.attachLabelToCard(cardId, labelId);
    res.json({ success: true, cardId, labelId });
  } catch (err) { next(err); }
};

const removeLabel = async (req, res, next) => {
  try {
    const { id: cardId, labelId } = req.params;
    await labelService.removeLabelFromCard(cardId, labelId);
    res.json({ success: true });
  } catch (err) { next(err); }
};

module.exports = { getAllLabels, attachLabel, removeLabel };
