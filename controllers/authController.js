const User = require('../models/User');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Auth = require('../models/Auth');
const logger = require('../services/loggingService');
const { validationResult } = require('express-validator');
const crypto = require('crypto');




exports.firebase_login = async (req, res) => {
  const { uid, email } = req.auth;
  const result = await User.getByEmail(email);
  if (result.rows.length == 0) {
    return res.status(401).json({ message: "Email n'existe pas!" });
  };
  const user = result.rows[0];
  if (user.is_active === false) {
    return res.status(403).json({ message: "Votre compte a été désactivé par l'administrateur" });
  };
  const accessToken = jwt.sign(
    { id: uid, email, role: user.role }, // role récupéré ou défini
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  const refreshToken = jwt.sign(
      { UserInfo : { id: user.user_id, role: user.role },},
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );
    await db.query("INSERT INTO refresh_tokens (token, user_id)  VALUES ($1,$2) returning *",[refreshToken, user.user_id ]) ;
    res.cookie("jwt", refreshToken, {
      httpOnly : true , // access du web server
      secure : true, // https
      sameSite : "None",
      maxAge : 7 * 24 * 60 * 60 * 1000,
    });
    logger.logAction(user.user_id,'LOGED IN', { 'user' : user.user_id });
    res.json({ message : 'WELCOME BACK', accessToken, user: { id: user.user_id, name: user.name, email: user.email, role: user.role } });

}
// Fichier : backend/controllers/userController.js
// Version pour le test, ne pas la laisser en production !

// const { admin } = require("../config/firebase"); <-- On garde l'import pour la prod

exports.firebase_register = async (req, res) => {
  // const authHeader = req.headers.authorization;
  // const token = authHeader.split(" ")[1];
  
  // try {
  //   const decodedToken = await admin.auth().verifyIdToken(token);
  //   const { uid, email } = decodedToken;

  // --- Version de test ---
  const { name, email, password, firebase_uid } = req.body;
  const uid = firebase_uid;
  // -----------------------

  try {
    // 2. Vérification de l'existence de l'utilisateur
    const existingUser = await User.getByEmail(email);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "L'utilisateur existe déjà" });
    }
    
    // ... le reste du code est inchangé
    const newUser = await User.create({
      name: name,
      email: email,
      role: "en_attente",
      firebase_id: uid
    });
    
    // ... le reste de la réponse est inchangé
    res.status(201).json({
      message: 'Compte créé avec succès. Il est en attente de validation par un administrateur.',
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        role: newUser.role,
        is_active: newUser.is_active
      }
    });

  } catch (err) {
    // Gestion des erreurs
    console.error('Erreur lors de l\'enregistrement de l\'utilisateur:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};
exports.refresh = async (req, res) => {
    const cookies = req.cookies ;
    if(!cookies?.jwt) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const refreshToken = cookies.jwt ;
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async(err, decoded) => {
    if (err) return res.status(403).json({ message: "Accès refusé" });
    const user = await User.getOne(decoded.UserInfo.id);
    if(!user) return res.status(403).json({ message : "Accès refusé"});
    const accessToken = jwt.sign(
      { UserInfo : { id: user.user_id, role: user.role },},
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    await db.query("INSERT INTO refresh_tokens(token, user_id) VALUES($1,$2)",[accessToken, decoded.UserInfo.id]);
    logger.logAction(decoded.UserInfo.id,'REFRESHED TOKEN', { 'user' : decoded.UserInfo.id});
    console.log(decoded);
    res.json({ accessToken })
 } 
)
};

exports.logout = async(req, res) => {
  const cookies = req.cookies ;
  if (!cookies?.jwt) return res.sendStatus(204);
  await db.query('DELETE FROM refresh_tokens WHERE token=$1',[cookies.jwt]);  // faut acceder au token 
  res.clearCookie("jwt", {
    httpOnly : true,
    sameSite : "None",
    secure : true,
  }) ;
  
  logger.logAction(req.auth.id,'LOGED OUT', { user : req.auth.id });
  res.json({message : "cookies suprrimes"}) ;
};

exports.updateEmail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { newEmail } = req.body;
  const userId = req.auth.id ;
  try {
    // Ici ta logique existante pour vérifier et mettre à jour l'email
    if (!newEmail) {
      return res.status(400).json({ message: "Email requis" });
    }
    
    // Vérifier si email déjà utilisé
    const existing = await User.getByEmail(newEmail);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Mettre à jour
    await Auth.updateemail(userId, newEmail);
    logger.logAction(req.auth.id,'UPDATED', { "email" : req.auth.id });
    res.json({ message: "Email mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.auth.id;
  console.log(userId);
  const { oldPassword, newPassword } = req.body;
  console.log(userId);
  try {
    // Ici ta logique existante pour vérifier et mettre à jour le mot de passe
    // Vérifier que tous les champs sont là
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Champs manquants" });
    }
    if (oldPassword === newPassword) {
      return res.status(396).json({ message : "l'ancien mot de passe et le nouveau mot de passe doivent tre différents"})
    }
    // Récupérer l'utilisateur
    console.log(userId);
    const result = await User.getOneonly(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(oldPassword, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    // Hasher nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await Auth.updatepassword(userId, hashedPassword);
    logger.logAction(req.auth.id,'UPDATED', { password : req.auth.id });
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatename = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const userId = req.auth.id;
  
  const { newName } = req.body;

  try {

    if ( !newName ) {
      return res.status(400).json({ message: "Champs manquants" });
    }


    
    const result = await User.getOneonly(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }


    // Mettre à jour
    await Auth.updatename(userId, newName);
    logger.logAction(req.auth.id,'UPDATED', { name : req.auth.id });
    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

