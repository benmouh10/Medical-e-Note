const db = require('../config/db');

module.exports = {
  create: async (token, userId) =>
    db.query('INSERT INTO refresh_tokens (token, user_id) VALUES ($1,$2) RETURNING *', [token, userId]),

  revoke: async (token) =>
    db.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [token]),

  find: async (token) =>
    db.query('SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false', [token])
};
