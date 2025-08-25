const db = require('../config/db');

module.exports = {
  upsert: async ({ user_id, email, code, expires_at }) => {
    return db.query(
      `INSERT INTO password_resets (user_id, email, code, expires_at)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (user_id)
       DO UPDATE SET email = EXCLUDED.email, code = EXCLUDED.code, expires_at = EXCLUDED.expires_at`,
      [user_id, email, code, expires_at]
    );
  },

  findValidByEmailAndCode: async (email, code) => {
    return db.query(
      `SELECT pr.*, u.user_id
       FROM password_resets pr
       JOIN users u ON u.user_id = pr.user_id
       WHERE pr.email = $1 AND pr.code = $2 AND pr.expires_at > NOW()`,
      [email, code]
    );
  },

  deleteByUserId: async (user_id) => {
    return db.query(`DELETE FROM password_resets WHERE user_id = $1`, [user_id]);
  },

  deleteExpired: async () => {
    return db.query(`DELETE FROM password_resets WHERE expires_at <= NOW()`);
  }
};
