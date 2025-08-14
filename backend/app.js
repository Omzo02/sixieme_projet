const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');  // Routes pour les livres
const userRoutes = require('./routes/userRoutes');  // Routes pour l'authentification


const path = require('path');

const app = express();


// Charger les variables d'environnement
dotenv.config();


// Middleware pour gérer les JSON
app.use(express.json());

// Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  

// Gérer les requêtes OPTIONS
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.log('Connexion à MongoDB échouée :', error));

// Déclaration des routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exporter l'application pour utilisation dans server.js
module.exports = app;
