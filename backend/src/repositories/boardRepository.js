const db = require('../config/db');

const findAll = async () => {
  const { rows } = await db.query(
    `SELECT * FROM boards ORDER BY created_at DESC;`
  );
  return rows;
};

const findById = async (id) => {
  const query = `
    SELECT 
      b.*,
      (
        SELECT COALESCE(json_agg(
          json_build_object(
            'id', l.id,
            'board_id', l.board_id,
            'title', l.title,
            'position', l.position,
            'created_at', l.created_at,
            'cards', (
              SELECT COALESCE(json_agg(
                json_build_object(
                  'id', c.id,
                  'list_id', c.list_id,
                  'title', c.title,
                  'description', c.description,
                  'position', c.position,
                  'due_date', c.due_date,
                  'is_archived', c.is_archived,
                  'created_at', c.created_at,
                  'labels', (
                    SELECT COALESCE(json_agg(lbl.*), '[]'::json)
                    FROM card_labels cl
                    JOIN labels lbl ON cl.label_id = lbl.id
                    WHERE cl.card_id = c.id
                  ),
                  'members', (
                    SELECT COALESCE(json_agg(mbr.*), '[]'::json)
                    FROM card_members cm
                    JOIN members mbr ON cm.member_id = mbr.id
                    WHERE cm.card_id = c.id
                  ),
                  'checklists', (
                    SELECT COALESCE(json_agg(chk.* ORDER BY chk.created_at ASC), '[]'::json)
                    FROM card_checklists chk
                    WHERE chk.card_id = c.id
                  )
                ) ORDER BY c.position ASC
              ), '[]'::json)
              FROM cards c
              WHERE c.list_id = l.id
            )
          ) ORDER BY l.position ASC
        ), '[]')
        FROM lists l
        WHERE l.board_id = b.id
      ) AS lists
    FROM boards b
    WHERE b.id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const query = `
    INSERT INTO boards (title, background)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [data.title, data.background || null];
  const { rows } = await db.query(query, values);
  return rows[0];
};

module.exports = {
  findAll,
  findById,
  create
};
