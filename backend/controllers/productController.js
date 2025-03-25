const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// @route   GET api/products
// @desc    Obtenir tous les produits
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sortBy,
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Construire le filtre
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }
    
    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }
    
    // Ajouter isActive par défaut
    filter.isActive = true;
    
    // Options de tri
    let sort = {};
    
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          sort = { price: 1 };
          break;
        case 'price_desc':
          sort = { price: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'rating':
          sort = { averageRating: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    } else {
      // Par défaut, trier par date de création (plus récent d'abord)
      sort = { createdAt: -1 };
    }
    
    // Pagination
    const skip = (page - 1) * limit;
    
    // Exécuter la requête
    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    
    // Compter le nombre total de produits pour la pagination
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// @route   GET api/products/:id
// @desc    Obtenir un produit par son ID
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name');
    
    if (!product) {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }
    
    res.json(product);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Produit non trouvé' });
    }
    
    res.status(500).send('Erreur serveur');
  }
};

// @route   POST api/products
// @desc    Créer un nouveau produit
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Créer le nouveau produit
    const newProduct = new Product(req.body);
    
    const product = await newProduct.save();
    
    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erreur serveur');
  }
};

// Autres méthodes du contrôleur (updateProduct, deleteProduct, addReview, etc.) 