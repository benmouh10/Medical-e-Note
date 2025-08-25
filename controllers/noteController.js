const Note = require('../models/Note');
const logger = require('../services/loggingService');
const cryptoService= require('../services/cryptoService');

exports.getNotes = async (req, res) => {
  try {
    const user_id = req.auth.id ;
    const result = await Note.getAll(user_id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Aucune note trouvée." });
    }
    logger.logAction(user_id,'SEARCHED FOR ', { note : "ALL" } );
    result.rows = result.rows.map(r => ({
                  ...r,
                  diagnosis : cryptoService.decrypt(r.diagnosis),
                  prescription : cryptoService.decrypt(r.prescription),
                  //attachments : cryptoService.decrypt(r.attachments)
                }));
    res.json(result.rows);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getNote = async (req, res) => {
  const id = req.params.id;
  user_id = req.auth.id ;
  try {
    const result = await Note.getOne(id, user_id);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Note introuvable." });
    }
    logger.logAction(user_id,'SEARCHED FOR ', { note : `${id}` } );
    result.rows = result.rows.map(r => ({
                  ...r,
                  diagnosis : cryptoService.decrypt(r.diagnosis),
                  prescription : cryptoService.decrypt(r.prescription),
                  // attachments : cryptoService.decrypt(r.attachments)
                }));
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createNote = async (req, res) => {
  try {
    const created_by = req.auth.id ;
    const {created_for, diagnosis, prescription, attachments } = req.body; 
    const result = await Note.create(created_by, req.body);
    logger.logAction(created_by , 'CREATED' , { note : `fff`});
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateNote = async (req, res) => {
  try {
    const id = req.params.id;
    const user_id = req.auth.id;
    const updateData = req.body;

    const result = await Note.update(id, updateData, user_id);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({ error: "Note introuvable pour mise à jour." });
    }
    logger.logAction(user_id, 'UPDATED ', {note : `${id}`});
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  const id = req.params.id;
  user_id = req.auth.id ;
  try {
    const result = await Note.deleteOne(id, user_id);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Note introuvable à supprimer." });
    }
    logger.logAction(user_id, "DELETED", { note : `${id}`});
    res.json({ message: `Note ${id} supprimée.`});
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteAllNotes = async (req, res) => {
  try {
    user_id = req.auth.id ;
    await Note.deleteAll(user_id);
    logger.logAction(user_id, 'DELETED', { note : "ALL"});
    res.json({ message: "Toutes les notes ont été supprimées." });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.searchNotes = async (req, res) => {
    try {
        user_id = req.auth.id ;
        const { created_for = '', page = 1, limit = 10, sort = 'ASC' } = req.query;
        const result = await Note.search({ user_id, created_for, page, limit, sort });
        logger.logAction(req.auth.id, 'SEARCHED FOR NOTES CREATED FOR ', { note : created_for});
        result.rows = result.rows.map(r => ({
                  ...r,
                  diagnosis : cryptoService.decrypt(r.diagnosis),
                  prescription : cryptoService.decrypt(r.prescription),
                  attachments : cryptoService.decrypt(r.attachments)
                }));
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
};
