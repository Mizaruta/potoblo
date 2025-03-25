const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const orderController = require('../../controllers/orderController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// @route   POST api/orders
// @desc    Créer une nouvelle commande
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('orderItems', 'Les articles de la commande sont requis').not().isEmpty(),
      check('shippingAddress.address', 'L\'adresse est requise').not().isEmpty(),
      check('shippingAddress.city', 'La ville est requise').not().isEmpty(),
      check('shippingAddress.postalCode', 'Le code postal est requis').not().isEmpty(),
      check('shippingAddress.country', 'Le pays est requis').not().isEmpty(),
      check('paymentMethod', 'La méthode de paiement est requise').not().isEmpty()
    ]
  ],
  orderController.createOrder
);

// @route   GET api/orders
// @desc    Obtenir toutes les commandes (admin)
// @access  Private/Admin
router.get('/', [auth, admin], orderController.getOrders);

// @route   GET api/orders/my-orders
// @desc    Obtenir les commandes de l'utilisateur connecté
// @access  Private
router.get('/my-orders', auth, orderController.getMyOrders);

// @route   GET api/orders/:id
// @desc    Obtenir une commande par son ID
// @access  Private
router.get('/:id', auth, orderController.getOrderById);

// @route   PUT api/orders/:id/pay
// @desc    Mettre à jour le statut de paiement d'une commande
// @access  Private
router.put('/:id/pay', auth, orderController.updateOrderToPaid);

// @route   PUT api/orders/:id/deliver
// @desc    Mettre à jour le statut de livraison d'une commande (admin)
// @access  Private/Admin
router.put('/:id/deliver', [auth, admin], orderController.updateOrderToDelivered);

// @route   PUT api/orders/:id/status
// @desc    Mettre à jour le statut d'une commande (admin)
// @access  Private/Admin
router.put(
  '/:id/status',
  [
    auth,
    admin,
    [
      check('status', 'Le statut est requis').not().isEmpty()
    ]
  ],
  orderController.updateOrderStatus
);

// @route   PUT api/orders/:id/cancel
// @desc    Annuler une commande
// @access  Private
router.put('/:id/cancel', auth, orderController.cancelOrder);

module.exports = router; 