const db = require('../config/db');

const findAll = async () => {
  const { rows } = await db.query(`SELECT * FROM members ORDER BY name ASC;`);
  return rows;
};

const attachToCard = async (cardId, memberId) => {
  const query = `
    INSERT INTO card_members (card_id, member_id)
    VALUES ($1, $2)
    ON CONFLICT (card_id, member_id) DO NOTHING;
  `;
  await db.query(query, [cardId, memberId]);
  return { success: true };
};

const removeFromCard = async (cardId, memberId) => {
  const query = `
    DELETE FROM card_members
    WHERE card_id = $1 AND member_id = $2;
  `;
  await db.query(query, [cardId, memberId]);
  return { success: true };
};

module.exports = { findAll, attachToCard, removeFromCard };
