const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// const { verifyToken } = require('../middlewares/authMiddleware');
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validateMiddleware");
const { loginLimiter } = require('../middlewares/rateLimiter');
const verifyToken = require('../middlewares/firebaseAuth')







router.get('/refresh', authController.refresh);

router.post('/logout',verifyToken, authController.logout); 

router.put(
  '/update-password',
  verifyToken,
  [
    body('oldPassword')
      .isLength({ min: 6 }).withMessage('Ancien mot de passe doit contenir au moins 6 caractères'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('Nouveau mot de passe doit contenir au moins 6 caractères')
      .matches(/[0-9]/).withMessage('Nouveau mot de passe doit contenir au moins un chiffre')
      .matches(/[A-Z]/).withMessage('Nouveau mot de passe doit contenir au moins une majuscule')
  ],
  authController.updatePassword
);

router.put(
  '/update-email',
  verifyToken,
  [
    body('newEmail')
      .isEmail().withMessage('Nouveau email invalide')
      .normalizeEmail()
  ],
  authController.updateEmail
);

router.put(
  '/update-name',
  verifyToken,
  [
    body('newName')
      .isLength({ min: 6 }).withMessage('Nouveau mot de passe doit contenir au moins 6 caractères')
  ],
  authController.updatename
);



router.post("/firebase-login", verifyToken, loginLimiter,  authController.firebase_login );

router.post("/firebase-register", verifyToken, loginLimiter, authController.firebase_register );

/**
 * @swagger
 * /auth/firebase-login:
 *   post:
 *     tags: [Auth]
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Requête invalide
 *
 * /auth/firebase-register:
 *   post:
 *     tags: [Auth]
 *     summary: Création d'un utilisateur (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *
 * /auth/refresh:
 *   get:
 *     tags: [Auth]
 *     summary: Rafraîchir le token
 *     responses:
 *       200:
 *         description: Token renouvelé
 *
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Déconnexion de l'utilisateur
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *
 * /auth/update-password:
 *   put:
 *     tags: [Auth]
 *     summary: Changer le mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour
 *
 * /auth/update-email:
 *   put:
 *     tags: [Auth]
 *     summary: Changer l'email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newEmail:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email mis à jour
 *
 * /auth/update-name:
 *   put:
 *     tags: [Auth]
 *     summary: Changer le nom
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nom mis à jour
 * /api/auth/forgot-password:
 *   post:
 *     summary: Envoyer un code de réinitialisation par email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordInput'
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Email non trouvé
 *
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordInput'
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Code invalide ou expiré
 */









module.exports = router;


