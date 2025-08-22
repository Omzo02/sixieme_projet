const express = require('express');
const router = express.Router();

// Importation du contrôleur des utilisateurs → contient la logique d’inscription et de connexion.
const userCtrl = require('../controllers/userControllers');

// Route d’inscription (signup).
router.post('/signup', userCtrl.signup);

// Route de connexion (login).
router.post('/login', userCtrl.login);

module.exports = router;