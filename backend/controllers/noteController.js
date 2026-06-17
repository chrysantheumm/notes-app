const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.getAll();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.getById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ message: 'Judul and isi are required' });
    }
    const newNote = await Note.create({ judul, isi });
    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const { judul, isi } = req.body;
    if (!judul || !isi) {
      return res.status(400).json({ message: 'Judul and isi are required' });
    }
    const updatedNote = await Note.update(req.params.id, { judul, isi });
    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const deleted = await Note.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Note not found or already deleted' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
