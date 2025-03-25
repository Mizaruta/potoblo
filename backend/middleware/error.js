exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ errors: messages });
  }

  // Erreur de duplication Mongoose
  if (err.code === 11000) {
    return res.status(400).json({ 
      errors: [`Duplication détectée: ${Object.keys(err.keyValue)} existe déjà`] 
    });
  }

  // Erreur de cast Mongoose (ID invalide)
  if (err.name === 'CastError') {
    return res.status(404).json({ 
      errors: [`Ressource non trouvée: ${err.path}`] 
    });
  }

  // Autres erreurs
  res.status(err.statusCode || 500).json({
    errors: [err.message || 'Erreur serveur']
  });
}; 