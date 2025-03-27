const Book = require('../models/Book');
const fs = require('fs');

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
exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });

  book.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

// Modifier un livre
exports.updateBook = (req, res, next) => {
  const bookObject = req.file ? {
      ...JSON.parse(req.body.book),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
      .then((book) => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Book.updateOne({ _id: req.params.id}, { ...bookObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

exports.getBestRatedBooks = async (req, res) => {
  try {
      const books = await Book.find().sort({ rating: -1 }).limit(3); // Trier par note descendante
      res.status(200).json(books);
  } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
  }
};


// Supprimer un livre
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

// Pour noter un livre

exports.rateBook = (req, res) => {
  const { grade } = req.body;
  const userId = req.auth.userId; // L'ID de l'utilisateur connecté
  const bookId = req.params.id;

  if (grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'La note doit être entre 0 et 5' });
  }

  Book.findById(bookId)
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const existingRating = book.ratings.find(rating => rating.userId.toString() === userId);
      if (existingRating) {
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }

      // Ajouter la nouvelle notation
      book.ratings.push({ userId, grade });

      // Recalculer la note moyenne
      const totalRatings = book.ratings.length;
      book.averageRating = book.ratings.reduce((sum, rating) => sum + rating.grade, 0) / totalRatings;

      return book.save();
    })
    .then(updatedBook => {
      res.status(201).json({ message: 'Notation enregistrée', book: updatedBook });
    })
    .catch(error => {
      res.status(500).json({ message: 'Erreur serveur', error });
    });
};