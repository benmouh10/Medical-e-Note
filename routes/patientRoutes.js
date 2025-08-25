const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { requireRole }  = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/firebaseAuth');
const { body, param } = require("express-validator");
const { validateRequest } = require("../middlewares/validateMiddleware");

router.get('/name', verifyToken, requireRole('medecin'), patientController.searchPatientsbyname);

router.get('/phone', verifyToken, requireRole('medecin'), patientController.searchPatientsbyphone);

router.get('/', verifyToken, requireRole('medecin'), patientController.getPatients);

router.get('/:id', verifyToken, requireRole('medecin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, patientController.getAPatient);

router.post('/', verifyToken, requireRole('medecin'), [
    body("name").notEmpty().withMessage("Le nom est obligatoire"),
    body("date_of_birth").isDate().withMessage("La date de naissance est obligatoire et doit être valide"),
    body("gender").isIn(["male", "female"]).withMessage("Genre absent ou invalide"),
    body("phone").isMobilePhone().withMessage("Numéro de téléphone absent ou invalide")
  ],
  validateRequest, patientController.createPatient);

router.put('/:id', verifyToken, requireRole('medecin'), [
    param("id").isInt().withMessage("L'ID doit être un entier"),
    body("name").optional().notEmpty().withMessage("Nom invalide"),
    body("date_of_birth").optional().isDate().withMessage("Date invalide"),
    body("gender").optional().isIn(["male", "female"]).withMessage("Genre invalide"),
    body("phone").optional().isMobilePhone().withMessage("Téléphone invalide")
  ],
  validateRequest, patientController.updateAPatient);

router.delete('/:id', verifyToken, requireRole('medecin'), [param("id").isInt().withMessage("L'ID doit être un entier")],
  validateRequest, patientController.deleteAPatient);

router.delete('/', verifyToken, requireRole('medecin'), patientController.deletePatients);



/**
 * @swagger
 * /patients:
 *   get:
 *     tags: [Patients]
 *     summary: Récupérer tous les patients
 *     responses:
 *       200:
 *         description: Liste des patients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Patient'
 *
 *   post:
 *     tags: [Patients]
 *     summary: Créer un patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       201:
 *         description: Patient créé
 *
 * /patients/{id}:
 *   get:
 *     tags: [Patients]
 *     summary: Récupérer un patient par ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient trouvé
 *
 *   put:
 *     tags: [Patients]
 *     summary: Mettre à jour un patient
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
 *             $ref: '#/components/schemas/PatientInput'
 *     responses:
 *       200:
 *         description: Patient mis à jour
 *
 *   delete:
 *     tags: [Patients]
 *     summary: Supprimer un patient
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Patient supprimé
 */
module.exports = router;


 


