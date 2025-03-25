const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si pas de token
  if (!token) {
    return res.status(401).json({ msg: 'Accès refusé, aucun token fourni' });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token invalide' });
  }
}; 