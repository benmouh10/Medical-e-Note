
const executeSecureQuery = require('../controllers/outil'); 
const db = require('../config/db');

const User = {
    // Récupérer tous les utilisateurs
    getAll: async () => {
        const query = `
            SELECT user_id, name, role, created_at, firebase_id, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users`;
        return executeSecureQuery(query);
    },

    // Récupérer un utilisateur par son ID
    getOne: async (id) => { 
        const query = `
            SELECT user_id, name, role, created_at, firebase_id, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users
            WHERE user_id = $1`;
        return executeSecureQuery(query, [id]);
    },

    // Récupérer un utilisateur par son email (fonction déjà correcte)
    getByEmail: async (email) => {
        const query = `
            SELECT user_id, name, role, created_at, firebase_id, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users 
            WHERE email = encrypt($1, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')`;
        return executeSecureQuery(query, [email]);
    },

    // Créer un nouvel utilisateur (fonction déjà correcte)
    create: async ({ name, email, role, firebase_id }) => {
        const query = `
            INSERT INTO users (name, email, role, firebase_id) 
            VALUES ($1, encrypt($2, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), $3, $4) 
            RETURNING user_id, name, role, firebase_id, is_active, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'UTF8'), 'UTF8') AS email`;
        const values = [name, email, role, firebase_id];
        const result = await executeSecureQuery(query, values);
        return result.rows[0];
    },

    // Fonction pour supprimer un utilisateur (ne nécessite pas de chiffrement)
    delete: async (id) => {
        return db.query("DELETE FROM users WHERE user_id = $1", [id]);
    }, 
    
    // Rechercher un utilisateur par nom
    searchbyname: async ({ name, page, limit, sort }) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT user_id, name, role, created_at, firebase_id, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users
            WHERE name ILIKE '%' || $1 || '%'
            ORDER BY created_at ${sort}
            LIMIT $2 OFFSET $3`;
        return executeSecureQuery(query, [name, limit, offset]);
    },

    // Rechercher un utilisateur par rôle
    searchbyrole: async ({ role, page, limit, sort }) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT user_id, name, role, created_at, firebase_id, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users
            WHERE role = $1
            ORDER BY created_at ${sort}
            LIMIT $2 OFFSET $3`;
        return executeSecureQuery(query, [role, limit, offset]);
    },

    // Mettre à jour le statut "actif" (ne nécessite pas de chiffrement)
    toggleActive: async (id) => {
        return db.query(
            "UPDATE users SET is_active = NOT is_active WHERE user_id = $1 RETURNING is_active",
            [id]
        );
    },

    // Mettre à jour le rôle (ne nécessite pas de chiffrement)
    updateRole: async (id, newRole) => {
        return db.query("UPDATE users SET role = $1 WHERE user_id = $2", [newRole, id]);
    },

    // Récupérer un utilisateur par son ID Firebase
    getbyfirebase: async (id) => { 
        const query = `
            SELECT user_id, name, role, created_at, 
            convert_from(decrypt(email, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS email 
            FROM users
            WHERE firebase_id = $1`;
        return executeSecureQuery(query, [id]);
    },

    // Supprimer un utilisateur par son ID Firebase (ne nécessite pas de chiffrement)
    deletebyfirebase: async (id) => {
        return db.query("DELETE FROM users WHERE firebase_id = $1", [id]);
    }, 
};

module.exports = User;