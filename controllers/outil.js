// Fichier : backend/utils/dbSecureQuery.js
const pool = require('../config/db'); // Votre pool de connexion
require('dotenv').config() ;

// Cette fonction gère l'ensemble de la logique de chiffrement
const executeSecureQuery = async (queryText, values) => {
    const client = await pool.connect();
    try {
        // Définir la clé pour cette session de client
        await client.query(`SET app.encryption_key TO '${process.env.ENCRYPTION_KEY}';`);

        // Exécuter la requête
        const result = await client.query(queryText, values);
        return result;
    } finally {
        // Toujours relâcher le client
        client.release();
    }
};

module.exports = executeSecureQuery;