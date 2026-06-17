const db = require('../config/db');

const Note = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM notes ORDER BY tanggal_dibuat DESC');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM notes WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (noteData) => {
    const { judul, isi } = noteData;
    const [result] = await db.query(
      'INSERT INTO notes (judul, isi) VALUES (?, ?)',
      [judul, isi]
    );
    return { id: result.insertId, ...noteData };
  },

  update: async (id, noteData) => {
    const { judul, isi } = noteData;
    await db.query(
      'UPDATE notes SET judul = ?, isi = ? WHERE id = ?',
      [judul, isi, id]
    );
    return { id, ...noteData };
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM notes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = Note;
