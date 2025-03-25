require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const { errorHandler } = require('./middleware/error');

// Connexion à la base de données
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes API
app.use('/api/products', require('./routes/api/products'));
app.use('/api/categories', require('./routes/api/categories'));
app.use('/api/orders', require('./routes/api/orders'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/payments', require('./routes/api/payments'));
app.use('/api/suppliers', require('./routes/api/suppliers'));

// Dossier statique pour les images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware de gestion des erreurs
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`)); 