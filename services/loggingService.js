
const db = require('../config/db');

exports.logAction = async (userId, action, details = {}) => {
  console.log(`[AUDIT] ${action} by User ${userId}`);
  await db.query(
    "INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)",
    [userId, action, details]
  );
};

