const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { requireRole }  = require('../middlewares/authMiddleware');
const { body, param } = require("express-validator");
const { validateRequest } = require("../middlewares/validateMiddleware");
const verifyToken = require('../middlewares/firebaseAuth');

router.get('/search', verifyToken, requireRole('medecin'), noteController.searchNotes);  // search by created_for

router.get('/', verifyToken, requireRole('medecin'), noteController.getNotes);

router.get('/:id', verifyToken, requireRole('medecin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, noteController.getNote);

router.post('/', verifyToken, requireRole('medecin'), [
    body("created_for").isInt().withMessage("L'ID du patient est obligatoire et doit être un entier"),
    body("diagnosis").notEmpty().withMessage("Le diagnostic est obligatoire"),
    body("prescription").notEmpty().withMessage("La prescription est obligatoire"),
    body("attachments").optional().isArray().withMessage("Les pièces jointes doivent être un tableau")
  ],
  validateRequest, noteController.createNote);
  
router.put('/:id', verifyToken, requireRole('medecin'), [
    param("id").isInt().withMessage("L'ID doit être un entier"),
    body("diagnosis").optional().notEmpty().withMessage("Diagnostic invalide"),
    body("prescription").optional().notEmpty().withMessage("Prescription invalide"),
    body("attachments").optional().isArray().withMessage("Les pièces jointes doivent être un tableau")
  ],
  validateRequest, noteController.updateNote);

router.delete('/:id', verifyToken, requireRole('medecin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, noteController.deleteNote);

router.delete('/', verifyToken, requireRole('medecin'), noteController.deleteAllNotes);



/**
 * @swagger
 * /notes:
 *   get:
 *     tags: [Notes]
 *     summary: Récupérer toutes les notes
 *     responses:
 *       200:
 *         description: Liste des notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *
 *   post:
 *     tags: [Notes]
 *     summary: Créer une note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note créée
 *
 * /notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Récupérer une note par ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note trouvée
 *
 *   put:
 *     tags: [Notes]
 *     summary: Mettre à jour une note
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       200:
 *         description: Note mise à jour
 *
 *   delete:
 *     tags: [Notes]
 *     summary: Supprimer une note
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Note supprimée
 */




module.exports = router;

