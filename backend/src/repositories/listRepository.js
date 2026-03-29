const db = require("../config/db");

const create = async (data) => {
  const query = `
    INSERT INTO lists (board_id, title, position)
    VALUES (
      $1, 
      $2, 
      COALESCE($3, (SELECT COALESCE(MAX(position), -1) + 1 FROM lists WHERE board_id = $1))
    )
    RETURNING *;
  `;
  const values = [data.board_id, data.title, data.position ?? null];
  const { rows } = await db.query(query, values);
  return rows[0];
};

const update = async (id, data) => {
  // Dynamically build the update query based on provided fields
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (data.title !== undefined) {
    updates.push(`title = $${paramIndex++}`);
    values.push(data.title);
  }

  if (data.position !== undefined) {
    updates.push(`position = $${paramIndex++}`);
    values.push(data.position);
  }

  // If no fields to update, return the existing row early (or throw)
  if (updates.length === 0) return null;

  values.push(id);
  const query = `
    UPDATE lists 
    SET ${updates.join(", ")} 
    WHERE id = $${paramIndex} 
    RETURNING *;
  `;

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

const remove = async (id) => {
  const query = `
    DELETE FROM lists
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

const reorder = async (listId, boardId, newPosition) => {
  let client;
  try {
    client = await db.getClient();
    await client.query("BEGIN");

    const listRes = await client.query(
      "SELECT position, board_id FROM lists WHERE id = $1",
      [listId],
    );
    if (listRes.rows.length === 0)
      throw { status: 404, message: "List not found" };

    const oldPosition = listRes.rows[0].position;
    if (listRes.rows[0].board_id !== boardId)
      throw { status: 400, message: "Board mismatch constraint" };

    // Shift logic mapped specifically to integer range blocks
    if (newPosition > oldPosition) {
      await client.query(
        `UPDATE lists SET position = position - 1 WHERE board_id = $1 AND position > $2 AND position <= $3;`,
        [boardId, oldPosition, newPosition],
      );
    } else if (newPosition < oldPosition) {
      await client.query(
        `UPDATE lists SET position = position + 1 WHERE board_id = $1 AND position >= $2 AND position < $3;`,
        [boardId, newPosition, oldPosition],
      );
    }

    const updateRes = await client.query(
      `UPDATE lists SET position = $1 WHERE id = $2 RETURNING *;`,
      [newPosition, listId],
    );

    await client.query("COMMIT");
    return updateRes.rows[0];
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    throw error;
  } finally {
    if (client) client.release();
  }
};

module.exports = {
  create,
  update,
  remove,
  reorder,
};
