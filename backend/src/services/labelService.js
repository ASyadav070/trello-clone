const labelRepository = require('../repositories/labelRepository');

const getAllLabels = () => labelRepository.findAll();
const attachLabelToCard = (cardId, labelId) => labelRepository.attachToCard(cardId, labelId);
const removeLabelFromCard = (cardId, labelId) => labelRepository.removeFromCard(cardId, labelId);

module.exports = { getAllLabels, attachLabelToCard, removeLabelFromCard };
