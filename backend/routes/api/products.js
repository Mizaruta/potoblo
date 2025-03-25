const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const productController = require('../../controllers/productController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const upload = require('../../middleware/upload');

// @route   GET api/products
// @desc    Obtenir tous les produits
// @access  Public
router.get('/', productController.getProducts);

// @route   GET api/products/:id
// @desc    Obtenir un produit par son ID
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST api/products
// @desc    Créer un nouveau produit
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    admin,
    upload.array('images', 5),
    [
      check('name', 'Le nom est requis').not().isEmpty(),
      check('description', 'La description est requise').not().isEmpty(),
      check('price', 'Le prix est requis').isNumeric(),
      check('category', 'La catégorie est requise').not().isEmpty(),
      check('stock', 'Le stock est requis').isNumeric()
    ]
  ],
  productController.createProduct
);

// @route   PUT api/products/:id
// @desc    Mettre à jour un produit
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    admin,
    upload.array('images', 5)
  ],
  productController.updateProduct
);

// @route   DELETE api/products/:id
// @desc    Supprimer un produit
// @access  Private/Admin
router.delete('/:id', [auth, admin], productController.deleteProduct);

// @route   POST api/products/:id/reviews
// @desc    Ajouter une évaluation à un produit
// @access  Private
router.post(
  '/:id/reviews',
  [
    auth,
    [
      check('rating', 'La note est requise').isNumeric(),
      check('rating', 'La note doit être entre 1 et 5').isFloat({ min: 1, max: 5 })
    ]
  ],
  productController.addReview
);

// @route   GET api/products/category/:categoryId
// @desc    Obtenir les produits par catégorie
// @access  Public
router.get('/category/:categoryId', productController.getProductsByCategory);

// @route   GET api/products/featured
// @desc    Obtenir les produits mis en avant
// @access  Public
router.get('/featured', productController.getFeaturedProducts);

module.exports = router; 