const {admin}= require("../config/firebase");

const { Client } = require('pg');
require('dotenv').config() ; 

const pgConfig = {
    user : process.env.DB_USER,
    host : process.env.DB_HOST,
    database : process.env.DB_NAME,
    password : process.env.DB_PASSWORD,
    port : process.env.DB_PORT,    
}
const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];
    let client;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const firebaseUid = decodedToken.uid;
        
        client = new Client(pgConfig);
        await client.connect();

        // Chercher l'utilisateur dans la base de données PostgreSQL en utilisant le UID de Firebase
        const result = await client.query('SELECT user_id, role, is_active FROM users WHERE firebase_id = $1', [firebaseUid]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé dans la base de données." });
        }

        const dbUser = result.rows[0];

        // Vérifier si le compte est actif
        if (!dbUser.is_active) {
            return res.status(403).json({ message: "Votre compte a été désactivé par un administrateur." });
        }

        // Si le rôle est "en_attente", l'accès est refusé
        if (dbUser.role === 'en_attente') {
            return res.status(403).json({ message: "Votre compte est en attente de validation." });
        }
        
        // Attacher les informations de l'utilisateur (y compris le rôle) à l'objet de requête
        req.auth = {
            firebaseUid: firebaseUid,
            role: dbUser.role,
            userId: dbUser.user_id // Pratique pour les requêtes futures
        };

        next();
    } catch (error) {
        console.error("Erreur d'authentification ou de base de données:", error);
        return res.status(403).json({ message: "Token invalide ou erreur de connexion à la base de données.", error: error.message });
    } finally {
        if (client) {
            await client.end();
        }
    }
};

module.exports = verifyToken;
