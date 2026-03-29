const db = require('../config/db');

const create = async (data) => {
  const query = `
    INSERT INTO cards (list_id, title, position)
    VALUES (
      $1, 
      $2, 
      (SELECT COALESCE(MAX(position), -1) + 1 FROM cards WHERE list_id = $1)
    )
    RETURNING *;
  `;
  const values = [data.list_id, data.title];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const findById = async (id) => {
  const query = `SELECT * FROM cards WHERE id = $1;`;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

const update = async (id, data) => {
  const updates = [];
  const values = [];
  let paramIndex = 1;

  const updatableFields = ['title', 'description', 'due_date', 'is_archived', 'cover_image'];
  
  updatableFields.forEach(field => {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${paramIndex++}`);
      values.push(data[field]);
    }
  });

  if (updates.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE cards 
    SET ${updates.join(', ')} 
    WHERE id = $${paramIndex} 
    RETURNING *;
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

const remove = async (id) => {
  const query = `DELETE FROM cards WHERE id = $1 RETURNING *;`;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

const reorder = async (cardId, sourceListId, destinationListId, newPosition) => {
  let client;
  try {
    client = await db.getClient();
    // Start serializable transaction to prevent race conditions (phantom reads/write skew) during concurrent rapid drags
    await client.query('BEGIN ISOLATION LEVEL SERIALIZABLE');

    // Verify card exists and capture its current configuration
    const cardRes = await client.query('SELECT position, list_id FROM cards WHERE id = $1', [cardId]);
    if (cardRes.rows.length === 0) {
      throw { status: 404, message: 'Card not found during reorder check' };
    }
    
    const oldPosition = cardRes.rows[0].position;
    
    // Safety check ensuring request matches database reality mapping
    if (cardRes.rows[0].list_id !== sourceListId) {
      throw { status: 400, message: 'Database mismatch: card does not originate from sourceListId' };
    }

    if (sourceListId === destinationListId) {
      // Scenario 1: Same List Reorder
      if (newPosition > oldPosition) {
        // Shifting Downward
        await client.query(
          `UPDATE cards SET position = position - 1 
           WHERE list_id = $1 AND position > $2 AND position <= $3;`,
          [sourceListId, oldPosition, newPosition]
        );
      } else if (newPosition < oldPosition) {
        // Shifting Upward
        await client.query(
          `UPDATE cards SET position = position + 1 
           WHERE list_id = $1 AND position >= $2 AND position < $3;`,
          [sourceListId, newPosition, oldPosition]
        );
      }
    } else {
      // Scenario 2: Cross List Reorder
      // Close gap in source
      await client.query(
        `UPDATE cards SET position = position - 1 
         WHERE list_id = $1 AND position > $2;`,
        [sourceListId, oldPosition]
      );
      
      // Open gap in destination
      await client.query(
        `UPDATE cards SET position = position + 1 
         WHERE list_id = $1 AND position >= $2;`,
        [destinationListId, newPosition]
      );
    }

    // Finalize card's new positional index
    const updateRes = await client.query(
      `UPDATE cards SET list_id = $1, position = $2 WHERE id = $3 RETURNING *;`,
      [destinationListId, newPosition, cardId]
    );

    await client.query('COMMIT');
    return updateRes.rows[0];

  } catch (error) {
    if (client) await client.query('ROLLBACK');
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  create,
  findById,
  update,
  remove,
  reorder
};
