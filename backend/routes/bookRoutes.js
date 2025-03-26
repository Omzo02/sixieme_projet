const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/bookControllers');
//Middleware d'authentification
const auth = require('../middleware/auth');
// Routes CRUD pour les livres
router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, bookCtrl.createBook);
router.get('/:id', auth, bookCtrl.getBookById);
router.put('/:id', auth, bookCtrl.updateBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
