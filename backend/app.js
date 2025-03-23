const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://sixieme_projet:***REMOVED***@cluster2.02aqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// Middleware pour gérer les JSON
app.use(express.json());


// Exporter l'application pour utilisation dans server.js
module.exports = app;
