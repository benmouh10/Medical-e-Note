/*const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

exports.generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  // store token after creation by caller
  return token;
};

exports.generateRefreshToken = async (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  // store token after creation by caller
  return token;
};

exports.storeRefreshToken = async (token, userId) => {
  return RefreshToken.create(token, userId);
};

exports.revokeRefreshToken = async (token) => {
  return RefreshToken.revoke(token);
};

exports.verifyStoredRefreshToken = async (token) => {
  const r = await RefreshToken.find(token);
  return r.rows.length ? r.rows[0] : null;
};
*/