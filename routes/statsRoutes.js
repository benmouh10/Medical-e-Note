
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { requireRole }  = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/firebaseAuth');
router.get('/getStats', verifyToken, requireRole('admin'), statsController.getStats);
router.get('/getmystats', verifyToken, requireRole('medecin'), statsController.getmystats);


/**
 * @swagger
 * /stats/getStats:
 *   get:
 *     tags: [Stats]
 *     summary: Récupérer les statistiques globales (admin only)
 *     responses:
 *       200:
 *         description: Statistiques
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *
 * /stats/getmystats:
 *   get:
 *     tags: [Stats]
 *     summary: Récupérer les statistiques personnelles (medecin only)
 *     responses:
 *       200:
 *         description: Statistiques personnelles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 */



module.exports=router;

