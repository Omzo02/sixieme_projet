const express = require('express');
const mongoose = require('mongoose');
const bookRoutes = require('./routes/bookRoutes');  // Routes pour les livres
const userRoutes = require('./routes/userRoutes');  // Routes pour l'authentification

const path = require('path');

const app = express();

// Middleware pour gérer les JSON
app.use(express.json());

// Gestion des erreurs CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  // Remplace par l'URL de ton frontend
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  

// Gérer les requêtes OPTIONS
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Connexion à MongoDB
mongoose.connect('mongodb+srv://sixieme_projet:O070375d@cluster2.02aqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2')
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(error => console.log('Connexion à MongoDB échouée :', error));

// Déclaration des routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exporter l'application pour utilisation dans server.js
module.exports = app;
