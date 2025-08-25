const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const uploadController = require("../controllers/uploadController");
const verifyToken = require('../middlewares/firebaseAuth');

router.post(
  "/upload",
  verifyToken, // ou verifyToken si JWT classique
  upload.single("file"),
  uploadController.uploadFile
);

module.exports = router;

/**
 * @swagger
 * /uploadAttachment:
 *   post:
 *     tags: [Upload]
 *     summary: Upload d'un fichier
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichier uploadé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 */


module.exports = router;

