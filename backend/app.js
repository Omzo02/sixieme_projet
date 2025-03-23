const express = require('express');
const app = express();


// Middleware pour gérer les JSON
app.use(express.json());


// Exporter l'application pour utilisation dans server.js
module.exports = app;
