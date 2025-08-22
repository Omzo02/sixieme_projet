const jwt = require('jsonwebtoken');

// Middleware d'authentification
module.exports = (req, res, next) => {
   try {
        // Récupère le token dans le header Authorization (ex: "Bearer <token>")
       const token = req.headers.authorization.split(' ')[1];
       // Vérifie que le token est valide avec la clé secrète
       // et récupère les informations stockées dans le payload
       const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
       // Ajoute l'ID de l'utilisateur authentifié à l'objet req
       // pour que les routes suivantes puissent l'utiliser
       req.auth = { userId: decodedToken.userId };
       // Passe la requête au middleware ou à la route suivante
       next();
   } catch (error) {
    // Si le token est absent, invalide ou expiré, renvoie une erreur 401
       res.status(401).json({ error: 'Requête non authentifiée !' });
   }
};
