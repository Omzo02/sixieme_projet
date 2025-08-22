// Import des modules
const bcrypt = require('bcrypt'); // Pour hacher et comparer les mots de passe
const User = require('../models/User'); // Modèle MongoDB pour les utilisateurs
const jwt = require('jsonwebtoken'); // Pour générer des tokens d’authentification

// Inscription
exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10) // Hachage du mot de passe avec 10 tours de salage
    .then(hash => {
      const user = new User({ // Création d’un nouvel utilisateur
        email: req.body.email,
        password: hash // Stockage du mot de passe haché, jamais en clair
      });
      return user.save(); // Sauvegarde dans la base de données
    })
    .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
    .catch(error => {
      // 400 = Mauvaise requête (ex: email déjà utilisé, données invalides)
      res.status(400).json({ error }); // Erreur (ex: email déjà utilisé)
    });
};

// Connexion
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // Recherche de l’utilisateur par email
    .then(user => {
      if (!user) {
        // 401 = Non autorisé → email incorrect
        return res.status(401).json({ error: 'Email ou mot de passe incorrect !' });
      }

      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) { // Si mot de passe incorrect
            return res.status(401).json({ error: 'Email ou mot de passe incorrect !' });
          }

          
          // Si tout est correct → création d’un token JWT
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET || 'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => {
          // Erreur serveur bcrypt
          console.error('Erreur comparaison mot de passe:', error);
          res.status(500).json({ error: 'Erreur interne du serveur' });
        });
    })
    .catch(error => {
      // Erreur serveur MongoDB
      console.error('Erreur recherche utilisateur:', error);
      res.status(500).json({ error: 'Erreur interne du serveur' });
    });
};
