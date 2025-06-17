const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookControllers');
//Middleware d'authentification
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Routes CRUD pour les livres
router.get('/bestrating', bookCtrl.getBestRatedBooks); // Obtenir les meilleur livres //
router.get('/', bookCtrl.getAllBooks); // Obtenir tous les livres //
router.post('/', auth, multer, bookCtrl.createBook); // Créer livre //
router.get('/:id', bookCtrl.getBookById); // Obtenir un livre //
router.put('/:id', auth, multer, bookCtrl.updateBook);// MAJ livre //
router.delete('/:id', auth, bookCtrl.deleteBook); // Supprimer un livre //
router.post('/:id/rating', auth, bookCtrl.rateBook); // Pour noter un livre //


module.exports = router;
