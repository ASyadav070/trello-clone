const db = require('../config/db');

const findAll = async () => {
  const { rows } = await db.query(`SELECT * FROM labels ORDER BY color ASC;`);
  return rows;
};

const attachToCard = async (cardId, labelId) => {
  const query = `
    INSERT INTO card_labels (card_id, label_id)
    VALUES ($1, $2)
    ON CONFLICT (card_id, label_id) DO NOTHING;
  `;
  await db.query(query, [cardId, labelId]);
  return { success: true };
};

const removeFromCard = async (cardId, labelId) => {
  const query = `
    DELETE FROM card_labels
    WHERE card_id = $1 AND label_id = $2;
  `;
  await db.query(query, [cardId, labelId]);
  return { success: true };
};

module.exports = { findAll, attachToCard, removeFromCard };
