const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireRole }  = require('../middlewares/authMiddleware');
const { body, param } = require("express-validator");
const { validateRequest } = require("../middlewares/validateMiddleware");
const verifyToken = require('../middlewares/firebaseAuth');

router.get('/name', verifyToken, requireRole('admin'), userController.searchUsersbyname);

router.get('/role', verifyToken, requireRole('admin'), userController.searchUsersbyrole);

router.get('/',  userController.getAllUsers);

router.get('/:id', verifyToken, requireRole('admin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, userController.getUser);

router.get('/:id', verifyToken, requireRole('admin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, userController.getfirebaseuser);

router.get('/route/email', verifyToken, requireRole('admin'), userController.getuserbyemail);

router.delete('/:id', verifyToken, requireRole('admin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, userController.deleteUser);

router.delete('/:id', verifyToken, requireRole('admin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, userController.deletebyFirebase);

router.delete('/:id', verifyToken, requireRole('admin'), userController.deleteUserGDPR);



/*
router.put(
  '/:id/toggle-access',
  verifyToken,
  requireRole('admin'),
  [ param('id').isInt().withMessage("L'ID doit être un entier") ],
  validateRequest,
  userController.toggleAccess
);

router.put(
  '/:id/role',
  verifyToken,
  requireRole('admin'),
  [
    param('id').isInt().withMessage("L'ID doit être un entier"),
    body('newRole').isIn(['admin', 'medecin']).withMessage('Rôle invalide')
  ],
  validateRequest,
  userController.updateUserRole
);
*/



/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer tous les utilisateurs (admin only)
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Récupérer un utilisateur par ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *   delete:
 *     tags: [Users]
 *     summary: Supprimer un utilisateur (admin only)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *
 * /users/name:
 *   get:
 *     tags: [Users]
 *     summary: Chercher les utilisateurs par nom
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *
 * /users/role:
 *   get:
 *     tags: [Users]
 *     summary: Chercher les utilisateurs par rôle
 *     parameters:
 *       - name: role
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *           enum: [admin, medecin]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 * /api/users/{id}/toggel-access:
 *   put:
 *     summary: Mettre à jour les accès d'un utilisateur (admin uniquement)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAccessInput'
 *     responses:
 *       200:
 *         description: Accès mis à jour avec succès
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Utilisateur non trouvé
 * /api/users/{id}/role:
 *   put:
 *     tags:
 *       - Users
 *     summary: Met à jour le rôle d'un utilisateur (Admin uniquement)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newRole:
 *                 type: string
 *                 enum: [admin, medecin, revoked]
 *                 description: Nouveau rôle à attribuer
 *             required:
 *               - newRole
 *     responses:
 *       200:
 *         description: Rôle mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Rôle invalide
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur serveur
 */




module.exports = router;

