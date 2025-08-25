/*
const jwt = require('jsonwebtoken');
  
exports.verifyToken1 = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded);
    req.auth = decoded.UserInfo;   
    console.log(req.auth.role)
    next();
  } catch (err) {
    res.status(403).json({ message: "Accès refusé" });
  }
};
 
*/


exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.auth.role !== role) {
      return res.status(403).json({ message: "Permission refusée" });
    }
    next();
  };
};