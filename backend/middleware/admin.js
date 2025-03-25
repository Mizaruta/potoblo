module.exports = (req, res, next) => {
  // Vérifier si l'utilisateur est admin
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Accès refusé: privilèges administrateur requis' });
  }
}; 