const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookControllers');
//Middleware d'authentification
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// Routes CRUD pour les livres
router.get('/bestrating', bookCtrl.getBestRatedBooks);
router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getBookById);
router.put('/:id', auth, multer, bookCtrl.updateBook);// MAJ livre //
router.delete('/:id', auth, bookCtrl.deleteBook);



module.exports = router;
