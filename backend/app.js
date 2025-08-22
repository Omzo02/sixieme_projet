const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/bookRoutes');  // Import des routes pour les livres
const userRoutes = require('./routes/userRoutes');  // Import des routes pour l'authentification


const path = require('path');

const app = express();


// Charger les variables d'environnement
dotenv.config();


// Middleware pour gérer les JSON dans le body
app.use(express.json());

// Gestion des erreurs CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {

    // Autorise uniquement le frontend local à accéder à l’API
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');  
    // Autorise certains en-têtes (dont Authorization → nécessaire pour JWT)
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
     // Méthodes HTTP autorisées
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
app.use('/api/books', bookRoutes); // Routes liées aux livres
app.use('/api/auth', userRoutes); // Routes liées à l’authentification (signup, login)
app.use('/images', express.static(path.join(__dirname, 'images'))); // Sert les images statiques (accès au dossier "images")


// Exporter l'application pour utilisation dans server.js
module.exports = app;
