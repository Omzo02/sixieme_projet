const Book = require('../models/Book');

// Obtenir tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

// Obtenir un livre par ID
exports.getBookById = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// Créer un livre
exports.createBook = (req, res) => {
  const book = new Book({ ...req.body });
  book.save()
    .then(() => res.status(201).json({ message: 'Livre créé avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};

// Modifier un livre
exports.updateBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre mis à jour !' }))
    .catch(error => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch(error => res.status(400).json({ error }));
};
