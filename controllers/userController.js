const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../services/loggingService');
const cryptoService = require('../services/cryptoService')

exports.getAllUsers = async (req, res) => {
  try {
    const result = await User.getAll();
    console.log('hi');
    //logger.logAction(req.auth.id,'SEARCHED FOR', { user : "ALL "});
    res.json(result.rows);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getfirebaseuser = async (req, res) => {
  try {
    const result = await User.getbyfirebase(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    logger.logAction(req.auth.id,'SEARCHED BY FIREBASE ID FOR', { user : `${req.params.id}`});
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};


exports.getUser = async (req, res) => {
  try {
    const result = await User.getOne(req.params.id);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    logger.logAction(req.auth.id,'SEARCHED FOR', { user : `${req.params.id}`});
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getuserbyemail = async (req, res) => {
  const email = req.query.email;
  console.log(email);
  if (!email) {
    return res.status(400).json({ message: 'Email est requis' });
  }
  try {
    const result = await User.getByEmail(email);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    logger.logAction(req.auth.id,'DELETED', { user : `${req.params.id}`});
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.searchUsersbyname = async (req, res) => {
    try {
        const { name = '', page = 1, limit = 10, sort = 'ASC' } = req.query;
        const result = await User.searchbyname({ name, page, limit, sort });
        logger.logAction(req.auth.id, 'SEARCHED FOR USERS', { user : name });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.searchUsersbyrole = async (req, res) => {
    try {
        const { role = '', page = 1, limit = 10, sort = 'ASC' } = req.query;
        const result = await User.searchbyrole({ role, page, limit, sort });
        logger.logAction(req.auth.id, 'SEARCHED FOR USERS ', { user : role });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json(err);
    }
};

exports.deleteUserGDPR = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('BEGIN');
    await db.query('DELETE FROM notes WHERE created_by=$1', [userId]);
    await db.query('DELETE FROM patients WHERE created_by=$1', [userId]);
    await db.query('DELETE FROM refresh_tokens WHERE user_id=$1', [userId]);
    await db.query('DELETE FROM users WHERE user_id=$1', [userId]);
    await db.query('COMMIT');
    await logger.logAction(req.auth?.id || null, 'GDPR_DELETE_USER', { targetUser: userId });
    res.json({ message: 'User and related data deleted' });
  } catch (err) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
};

exports.deletebyFirebase = async (req, res) => {
  try {
    const result = await User.deletebyfirebase(req.params.id);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    logger.logAction(req.auth.id,'DELETED', { firebase_user : `${req.params.id}`});
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json(err);
  }
};


