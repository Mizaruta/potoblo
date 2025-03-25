const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

// @route   POST api/payments/create-payment-intent
// @desc    Créer une intention de paiement Stripe
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }
    
    // Vérifier que l'utilisateur est le propriétaire de la commande
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Non autorisé' });
    }
    
    // Vérifier que la commande n'a pas déjà été payée
    if (order.isPaid) {
      return res.status(400).json({ msg: 'Cette commande a déjà été payée' });
    }
    
    // Créer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Conversion en centimes
      currency: 'eur',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user.id
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   POST api/payments/confirm
// @desc    Confirmer un paiement
// @access  Private
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;
    
    // Récupérer la commande
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ msg: 'Commande non trouvée' });
    }
    
    // Vérifier que l'utilisateur est le propriétaire de la commande
    if (order.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Non autorisé' });
    }
    
    // Récupérer l'intention de paiement de Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Vérifier que l'intention de paiement correspond à la commande
    if (paymentIntent.metadata.orderId !== orderId) {
      return res.status(400).json({ msg: 'Les informations de paiement ne correspondent pas' });
    }
    
    // Mettre à jour la commande
    order.isPaid = true;
    order.paidAt = Date.now();
    order.status = 'payée';
    order.paymentResult = {
      id: paymentIntentId,
      status: paymentIntent.status,
      update_time: new Date().toISOString(),
      email_address: req.user.email
    };
    
    await order.save();
    
    res.json({ success: true, order });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
}; 