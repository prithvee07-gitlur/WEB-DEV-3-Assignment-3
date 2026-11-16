const Note = require('../models/Note');

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const note = new Note({ title, content, owner: req.user.id });
        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const filter = req.user.role === 'admin' ? {} : { owner: req.user.id };
        const notes = await Note.find(filter);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        const filter = req.user.role === 'admin'
            ? { _id: req.params.id }
            : { _id: req.params.id, owner: req.user.id };
        const note = await Note.findOneAndUpdate(
            filter,
            { title, content },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const filter = req.user.role === 'admin'
            ? { _id: req.params.id }
            : { _id: req.params.id, owner: req.user.id };
        const note = await Note.findOneAndDelete(filter);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
