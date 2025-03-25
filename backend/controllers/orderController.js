const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const supplierAPI = require('../utils/supplierAPI');
const sendEmail = require('../utils/emailService');

// @route   POST api/orders
// @desc    Créer une nouvelle commande
// @access  Private
exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;
    
    // Vérifier la disponibilité des produits
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ 
          msg: `Produit ${item.name} non trouvé`
        });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          msg: `Quantité insuffisante pour ${item.name}. Disponible: ${product.stock}`
        });
      }
    }
    
    // Créer la commande
    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    // Sauvegarder la commande
    const createdOrder = await order.save();
    
    // Mettre à jour le stock des produits
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }
    
    // Préparer les commandes fournisseurs
    const supplierOrders = {};
    
    for (const item of orderItems) {
      const product = await Product.findById(item.product).populate('supplier');
      
      if (!supplierOrders[product.supplier._id]) {
        supplierOrders[product.supplier._id] = {
          supplier: product.supplier._id,
          items: []
        };
      }
      
      supplierOrders[product.supplier._id].items.push({
        productId: product.supplierProductId,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Envoyer les commandes aux fournisseurs
    const supplierOrdersArray = [];
    
    for (const supplierId in supplierOrders) {
      try {
        // Appeler l'API du fournisseur
        const result = await supplierAPI.placeOrder(
          supplierId,
          supplierOrders[supplierId].items,
          {
            orderRef: createdOrder._id,
            shippingAddress: shippingAddress
          }
        );
        
        supplierOrdersArray.push({
          supplier: supplierId,
          orderId: result.orderId,
          status: 'confirmée',
          items: supplierOrders[supplierId].items
        });
      } catch (error) {
        console.error(`Erreur lors de la commande chez le fournisseur ${supplierId}:`, error);
        
        supplierOrdersArray.push({
          supplier: supplierId,
          status: 'erreur',
          items: supplierOrders[supplierId].items
        });
      }
    }
    
    // Mettre à jour la commande avec les informations des fournisseurs
    createdOrder.supplierOrders = supplierOrdersArray;
    await createdOrder.save();
    
    // Envoyer un email de confirmation
    await sendEmail({
      to: req.user.email,
      subject: `Confirmation de commande #${createdOrder._id}`,
      text: `Votre commande #${createdOrder._id} a été reçue et est en cours de traitement. Merci pour votre achat!`
    });
    
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Autres méthodes (getOrders, getOrderById, updateOrderStatus, etc.) 