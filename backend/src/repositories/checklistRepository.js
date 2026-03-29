const db = require('../config/db');

const create = async (cardId, title) => {
  const query = `
    INSERT INTO card_checklists (card_id, title, is_complete)
    VALUES ($1, $2, false)
    RETURNING *;
  `;
  const { rows } = await db.query(query, [cardId, title]);
  return rows[0];
};

const update = async (itemId, data) => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }
  if (data.is_complete !== undefined) {
    updates.push(`is_complete = $${paramIndex++}`);
    values.push(data.is_complete);
  }

  if (updates.length === 0) return null;

  values.push(itemId);
  const query = `
    UPDATE card_checklists 
    SET ${updates.join(', ')} 
    WHERE id = $${paramIndex} 
    RETURNING *;
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

const remove = async (itemId) => {
  const query = `DELETE FROM card_checklists WHERE id = $1 RETURNING *;`;
  const { rows } = await db.query(query, [itemId]);
  return rows[0] || null;
};

module.exports = { create, update, remove };
