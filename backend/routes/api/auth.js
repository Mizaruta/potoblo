const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../../controllers/authController');
const auth = require('../../middleware/auth');

// @route   POST api/auth/register
// @desc    Inscription d'un utilisateur
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Le nom est requis').not().isEmpty(),
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
  ],
  authController.register
);

// @route   POST api/auth/login
// @desc    Authentification & obtention du token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'Veuillez inclure un email valide').isEmail(),
    check('password', 'Le mot de passe est requis').exists()
  ],
  authController.login
);

// @route   GET api/auth/user
// @desc    Obtenir les infos de l'utilisateur
// @access  Private
router.get('/user', auth, authController.getUser);

// @route   GET api/auth/verify-email/:token
// @desc    Vérifier l'email d'un utilisateur
// @access  Public
router.get('/verify-email/:token', authController.verifyEmail);

// @route   POST api/auth/forgot-password
// @desc    Demander une réinitialisation de mot de passe
// @access  Public
router.post(
  '/forgot-password',
  [
    check('email', 'Veuillez inclure un email valide').isEmail()
  ],
  authController.forgotPassword
);

// @route   POST api/auth/reset-password/:token
// @desc    Réinitialiser le mot de passe
// @access  Public
router.post(
  '/reset-password/:token',
  [
    check('password', 'Le mot de passe doit contenir au moins 6 caractères').isLength({ min: 6 })
  ],
  authController.resetPassword
);

module.exports = router; 