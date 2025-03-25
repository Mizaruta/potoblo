const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/emailService');

// @route   POST api/auth/register
// @desc    Inscription d'un utilisateur
// @access  Public
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Vérifier si l'email existe déjà
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'Cet email est déjà utilisé' }] });
    }

    // Générer le token de vérification
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');

    // Créer le nouvel utilisateur
    user = new User({
      name,
      email,
      password,
      emailVerificationToken
    });

    await user.save();

    // Envoyer l'email de vérification
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Vérification de votre adresse email',
      text: `Bienvenue sur DropStyle ! Veuillez cliquer sur le lien suivant pour vérifier votre adresse email: ${verificationUrl}`
    });

    // Créer et retourner le token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   POST api/auth/login
// @desc    Authentification & obtention du token
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Identifiants invalides' }] });
    }

    // Créer et retourner le token JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET api/auth/user
// @desc    Obtenir les infos de l'utilisateur
// @access  Private
exports.getUser = async (req, res) => {
  try {
    // Récupérer l'utilisateur sans le mot de passe
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
}; 