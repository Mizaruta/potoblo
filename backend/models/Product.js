const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  salePrice: {
    type: Number,
    min: 0,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  images: [
    {
      type: String,
      required: true
    }
  ],
  videoUrl: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  ratings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      review: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  averageRating: {
    type: Number,
    default: 0
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  supplierProductId: {
    type: String,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  dimensions: {
    width: Number,
    height: Number,
    depth: Number,
    weight: Number
  },
  variations: [
    {
      name: String,
      options: [
        {
          value: String,
          priceModifier: {
            type: Number,
            default: 0
          },
          stockQuantity: {
            type: Number,
            default: 0
          }
        }
      ]
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Mise à jour de la date de modification
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calcul de la note moyenne avant sauvegarde
ProductSchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((sum, item) => sum + item.rating, 0) / this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema); 