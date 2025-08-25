// Fichier : uploadcontroller.js
const { bucket } = require("../firebase");
const fs = require("fs");     
const db = require("../config/db"); // Votre pool de connexion
const cryptoService = require("../services/cryptoService"); // <-- Importer le service de chiffrement

exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucun fichier uploadé." });
        }

        // Récupérer l'ID de la note et l'ID du patient (qui a créé la note)
        const { noteId, created_for } = req.body;
        if (!noteId || !created_for) {
            return res.status(400).json({ message: "Les IDs du patient et de la note sont requis." });
        }

        // Chemin dans Firebase Storage
        const destination = `notes/${created_for}/${Date.now()}-${req.file.originalname}`;
        await bucket.upload(req.file.path, {
            destination,
            metadata: { contentType: req.file.mimetype },
        });

        // Supprimer le fichier local temporaire
        fs.unlinkSync(req.file.path);

        // Générer une URL signée (longue durée)
        const file = bucket.file(destination);
        const [url] = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2500", // URL très longue durée
        });

        // 🔹 Chiffrer l'URL avant de la stocker
        const encryptedUrl = cryptoService.encrypt(url);

        // 🔹 Mettre à jour la colonne attachments[] d'une seule note
        await db.query(
            "UPDATE notes SET attachments = array_append(attachments, $1) WHERE note_id = $2 AND created_for = $3",
            [encryptedUrl, noteId, created_for]
        );

        res.json({
            message: "Fichier uploadé et attaché à la note avec succès.",
            noteId,
            created_for,
            fileUrl: url,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de l'upload.", error: err.message });
    }
};