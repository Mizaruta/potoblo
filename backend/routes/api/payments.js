const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/paymentController');
const auth = require('../../middleware/auth');

// @route   POST api/payments/create-payment-intent
// @desc    Créer une intention de paiement Stripe
// @access  Private
router.post('/create-payment-intent', auth, paymentController.createPaymentIntent);

// @route   POST api/payments/confirm
// @desc    Confirmer un paiement
// @access  Private
router.post('/confirm', auth, paymentController.confirmPayment);

// @route   POST api/payments/webhook
// @desc    Webhook Stripe pour les événements de paiement
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

module.exports = router; 