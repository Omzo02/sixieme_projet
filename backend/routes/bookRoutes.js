const express = require('express');
const router = express.Router();

// Importation du contrôleur des livres → toutes les fonctions CRUD (create, read, update, delete) 
// et autres logiques liées aux livres.
const bookCtrl = require('../controllers/bookControllers'); 

// Middleware d’authentification → vérifie le token JWT pour s’assurer 
// que seules les personnes connectées puissent créer/modifier/supprimer un livre.
const auth = require('../middleware/auth');

// Middleware Multer → utilisé pour gérer l’upload des images (en mémoire puis compressées avec Sharp).
const multer = require('../middleware/multer-config');

// Routes CRUD pour les livres
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Obtenir les meilleur livres.
router.get('/', bookCtrl.getAllBooks); // Obtenir tous les livres.
router.post('/', auth, multer, bookCtrl.createBook); // Créer un nouveau livre → nécessite d’être authentifié + upload d’image via Multer.
router.get('/:id', bookCtrl.getBookById); // Obtenir un livre  via son ID.
router.put('/:id', auth, multer, bookCtrl.updateBook); // Modifier un livre → nécessite d’être authentifié + possibilité de changer l’image.
router.delete('/:id', auth, bookCtrl.deleteBook); // Supprimer un livre → nécessite d’être authentifié.
router.post('/:id/rating', auth, bookCtrl.rateBook); // Noter un livre → nécessite d’être authentifié.


module.exports = router;
