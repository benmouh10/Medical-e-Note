const db = require('../config/db');
const executeSecureQuery = require('../controllers/outil'); 
const cryptoService = require('../services/cryptoService'); // Assurez-vous d'importer votre service

module.exports = {
    // Récupérer toutes les notes
    getAll: async (id) => {
        const query = `
            SELECT note_id, created_for, created_by, created_at, attachments,
            convert_from(decrypt(diagnosis, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS diagnosis,
            convert_from(decrypt(prescription, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS prescription
            FROM notes WHERE created_by = $1`;
        const result = await executeSecureQuery(query, [id]);
        
        // Déchiffrer le tableau d'attachments côté Node.js
        return result.rows.map(row => ({
            ...row,
            attachments: row.attachments.map(item => cryptoService.decrypt(item)),
        }));
    },

    // Récupérer une seule note
    getOne: async (id, user_id) => {
        const query = `
            SELECT note_id, created_for, created_by, created_at, attachments,
            convert_from(decrypt(diagnosis, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS diagnosis,
            convert_from(decrypt(prescription, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS prescription
            FROM notes WHERE note_id = $1 AND created_by = $2`;
        const result = await executeSecureQuery(query, [id, user_id]);
        if (result.rows.length === 0) return null;
        
        const note = result.rows[0];
        // Déchiffrer le tableau d'attachments côté Node.js
        return {
            ...note,
            attachments: note.attachments.map(item => cryptoService.decrypt(item)),
        };
    },

    // Créer une note
    create: async (id, { created_for, diagnosis, prescription, attachments, created_at }) => {
        // Chiffrer le tableau d'attachments côté Node.js
        const encryptedAttachments = attachments.map(item => cryptoService.encrypt(item));
        
        const query = `
            INSERT INTO notes (created_for, created_by, diagnosis, prescription, attachments, created_at)
            VALUES ($1, $2, 
            encrypt($3, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'),
            encrypt($4, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'),
            $5,
            $6) RETURNING *`;
        const values = [created_for, id, diagnosis, prescription, encryptedAttachments, created_at];
        return executeSecureQuery(query, values);
    },

    // Mettre à jour une note
    update: async (id, fields, user_id) => {
        const updateFields = { ...fields };
        
        // Chiffrer les champs nécessaires côté Node.js
        if (updateFields.attachments) {
            updateFields.attachments = updateFields.attachments.map(item => cryptoService.encrypt(item));
        }
        
        let idx = 1;
        const setString = Object.keys(updateFields).map(key => {
            if (key === 'diagnosis' || key === 'prescription') {
                return `${key} = encrypt($${idx++}, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')`;
            }
            return `${key}=$${idx++}`;
        }).join(', ');
        
        const values = Object.keys(updateFields).map(key => updateFields[key]);
        values.push(id, user_id);
        
        const query = `UPDATE notes SET ${setString} WHERE note_id=$${idx++} AND created_by=$${idx} RETURNING *`;
        return executeSecureQuery(query, values);
    },

    // Supprimer une note
    deleteOne: async (id, user_id) => {
        return db.query("DELETE FROM notes WHERE note_id = $1 AND created_by=$2", [id, user_id]);
    },

    // Supprimer toutes les notes d'un utilisateur
    deleteAll: async (id) => {
        return db.query("DELETE FROM notes WHERE created_by=$1", [id]);
    },

    // Rechercher une note
    search: async ({ user_id, created_for, page, limit, sort }) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT note_id, created_for, created_by, created_at, attachments,
            convert_from(decrypt(diagnosis, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS diagnosis,
            convert_from(decrypt(prescription, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS prescription
            FROM notes
            WHERE created_for = $1 AND created_by = $2
            ORDER BY created_at ${sort}
            LIMIT $3 OFFSET $4`;
        const values = [created_for, user_id, limit, offset];
        const result = await executeSecureQuery(query, values);

        // Déchiffrer le tableau d'attachments côté Node.js
        return result.rows.map(row => ({
            ...row,
            attachments: row.attachments.map(item => cryptoService.decrypt(item)),
        }));
    }
};