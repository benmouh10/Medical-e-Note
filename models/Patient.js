
const executeSecureQuery = require('../controllers/outil'); 
const db = require('../config/db');

module.exports = {
    // Récupérer tous les patients créés par un utilisateur spécifique
    getAll: async (id) => {
        const query = `
            SELECT patient_id, name, date_of_birth, gender, created_by, created_at, 
            convert_from(decrypt(phone, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS phone 
            FROM patients
            WHERE created_by = $1`;
        return executeSecureQuery(query, [id]);
    },

    // Récupérer un seul patient
    getone: async (user_id, id) => {
        const query = `
            SELECT patient_id, name, date_of_birth, gender, created_by, created_at, 
            convert_from(decrypt(phone, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS phone 
            FROM patients
            WHERE patient_id = $1 AND created_by = $2`;
        return executeSecureQuery(query, [id, user_id]);
    },

    // Créer un nouveau patient
    create: async (id, { name, date_of_birth, gender, created_at, phone }) => {
        const query = `
            INSERT INTO patients (name, date_of_birth, gender, created_by, created_at, phone) 
            VALUES ($1, $2, $3, $4, $5, encrypt($6, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')) 
            RETURNING *`;
        const values = [name, date_of_birth, gender, id, created_at, phone];
        const result = await executeSecureQuery(query, values);
        return result.rows[0];
    },

    // Mettre à jour un patient
    update: async (id, fields, user_id) => {
        const keys = Object.keys(fields);
        if (keys.length === 0) return null;

        let idx = 1;
        const setString = keys.map(key => {
            // Chiffrement du numéro de téléphone si il est présent
            if (key === 'phone') {
                return `phone = encrypt($${idx++}, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')`;
            }
            return `${key}=$${idx++}`;
        }).join(', ');
        
        const values = keys.map(key => fields[key]);
        values.push(id, user_id);
        
        const query = `UPDATE patients SET ${setString} 
                       WHERE patient_id=$${idx++} 
                       AND created_by=$${idx} RETURNING *`;
        return executeSecureQuery(query, values);
    },

    // Supprimer un patient
    deleteone: async (id, user_id) => {
        return db.query("DELETE FROM patients WHERE patient_id=$1 AND created_by=$2", [id, user_id]);
    },

    // Supprimer tous les patients d'un utilisateur
    deleteAll: async (user_id) => {
        return db.query("DELETE FROM patients WHERE created_by=$1", [user_id]);
    },

    // Rechercher par nom
    search_by_name: async ({ user_id, name, page, limit, sort }) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT patient_id, name, date_of_birth, gender, created_by, created_at, 
            convert_from(decrypt(phone, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS phone 
            FROM patients 
            WHERE created_by = $1 AND name ILIKE '%' || $2 || '%' 
            ORDER BY created_at ${sort}
            LIMIT $3 OFFSET $4`;
        return executeSecureQuery(query, [user_id, name, limit, offset]);
    },

    // Rechercher par téléphone
    search_by_phone: async ({ user_id, phone, page, limit, sort }) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT patient_id, name, date_of_birth, gender, created_by, created_at, 
            convert_from(decrypt(phone, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc'), 'UTF8') AS phone 
            FROM patients 
            WHERE created_by = $1 AND phone = encrypt($2, decode(current_setting('app.encryption_key'), 'hex'), 'aes-cbc')
            ORDER BY created_at ${sort}
            LIMIT $3 OFFSET $4`;
        const values = [user_id, phone, limit, offset];
        return executeSecureQuery(query, values);
    }
};