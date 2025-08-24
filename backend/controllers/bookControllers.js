const Book = require('../models/Book');
const fs = require('fs');

// Obtenir tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then(books => res.status(200).json(books)) // On renvoie les livres au client avec le code HTTP 200 (OK)
    .catch(error => res.status(500).json({ error })); // erreur serveur si problème DB
};

// Obtenir un livre spécifique à partir de son ID
exports.getBookById = (req, res) => {
  // Book.findOne() cherche dans la collection "books" un document dont l'_id correspond à req.params.id
  Book.findOne({ _id: req.params.id })
    .then(book => {
      // Si aucun livre n'est trouvé (book est null)
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      // Si le livre est trouvé, on renvoie le livre avec le code 200 (OK)
      return res.status(200).json(book);
    })
    .catch(error => 
      // Si une erreur survient (ex: ID malformé ou problème serveur), on renvoie une erreur 500
      res.status(500).json({ error })
    );
};

// Créer un nouveau livre 
exports.createBook = (req, res, next) => {
  // On récupère les données du livre envoyées dans le corps de la requête (sous forme de JSON string)
  const bookObject = JSON.parse(req.body.book);

  // On supprime l'ID et l'userId envoyés par le client pour éviter toute manipulation malveillante
  delete bookObject._id;
  delete bookObject._userId;

  // On crée une nouvelle instance du modèle Book avec les données reçues
  const book = new Book({
    ...bookObject, // On copie toutes les autres propriétés
    userId: req.auth.userId, // On associe le livre à l'utilisateur connecté
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // On construit l'URL de l'image uploadée
  });

  // On enregistre le livre dans la base de données
  book.save()
    .then(() => 
      // Si tout se passe bien, on renvoie le code 201 (Créé) avec un message de confirmation
      res.status(201).json({ message: 'Livre enregistré !' })
    )
    .catch(error => 
      // Si une erreur survient (ex: données invalides), on renvoie le code 400 (Bad Request) avec l'erreur
      res.status(400).json({ error })
    );
};


// Modifier un livre
exports.updateBook = (req, res, next) => {
  // 1️⃣ Si une nouvelle image est envoyée, on construit un nouvel objet livre
  // avec les infos du body + la nouvelle imageUrl
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book), // On parse car 'book' est envoyé en JSON (multipart/form-data)
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    // Sinon, pas de nouvelle image → on prend directement le corps de la requête
    : { ...req.body };

  // 2️⃣ On supprime l'userId du body pour éviter qu'un utilisateur malveillant ne modifie le propriétaire
  delete bookObject._userId;

  // 3️⃣ Recherche du livre dans la base avec son id
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // 4️⃣ Vérification que l'utilisateur est bien le propriétaire du livre
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Accès interdit' });
      }

      // 5️⃣ Si une nouvelle image est uploadée → on supprime l’ancienne du dossier images
      if (req.file) {
        const oldFilename = book.imageUrl.split('/images/')[1];
        fs.unlink(`images/${oldFilename}`, (err) => {
          if (err) console.log("Erreur suppression ancienne image :", err);
        });
      }

      // 6️⃣ Mise à jour du livre avec les nouvelles données
      return Book.updateOne(
        { _id: req.params.id },
        { ...bookObject, _id: req.params.id }
      ).then(() => res.status(200).json({ message: 'Livre modifié !' }));
    })
    .catch(error => res.status(400).json({ error }));
};


// Afficher les trois meilleurs livres
exports.getBestRatedBooks = (req, res) => {
  // 1️⃣ Récupération des livres, triés par la moyenne de note (du plus grand au plus petit)
  Book.find().sort({ averageRating: -1 }).limit(3)
    .then(books => res.status(200).json(books)) // 2️⃣ Réponse envoyée au front avec seulement les 3 premiers
    .catch(error => res.status(500).json({ message: "Erreur serveur", error })); // 3️⃣ Gestion des erreurs serveur (ex: problème avec MongoDB)
};


// Supprimer un livre
exports.deleteBook = (req, res, next) => {

  // 1️⃣ On cherche le livre dans la base de donnée avec son id
  Book.findOne({ _id: req.params.id })
    .then(book => {

      // 2️⃣ Vérifie si le livre existe
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // 3️⃣ Vérification que l'utilisateur connecté est bien le propriétaire du livre
      if (book.userId != req.auth.userId) {
        return res.status(403).json({ message: 'Accès interdit' });
      }

      // 4️⃣ Récupération du nom de fichier de l'image à partir de son URL
      const filename = book.imageUrl.split('/images/')[1];

      // 5️⃣ Suppression du fichier image dans le dossier /images
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
          .catch(error => res.status(500).json({ error })); // Erreur serveur
      });
    })
    .catch(error => res.status(500).json({ error })); // Erreur serveur 
};

// Noter un livre
exports.rateBook = (req, res) => {
  const { grade } = req.body; // Récupération de la note envoyée par le front
  const userId = req.auth.userId; // On identifie l'utilisateur qui note
  const bookId = req.params.id; // Id du livre à noter

  // 1️⃣ Vérification que la note est comprise entre 0 et 5
  if (grade < 0 || grade > 5) {
    return res.status(400).json({ message: 'La note doit être entre 0 et 5' });
  }

  // 2️⃣ On récupère le livre dans la base par son id
  Book.findById(bookId)
    .then(book => {
      if (!book) { // Vérifie si le livre existe
        return res.status(404).json({ message: 'Livre non trouvé' });
      }

      // 3️⃣ Vérification : est-ce que l'utilisateur a déjà noté ce livre ?
      const existingRating = book.ratings.find(
        rating => rating.userId.toString() === userId
      );

      if (existingRating) {
        // L'utilisateur a déjà noté => on bloque la requête
        return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
      }
      
      // 4️⃣ Ajout de la nouvelle note dans le tableau ratings
      book.ratings.push({ userId, grade });

      // 5️⃣ Recalcul de la moyenne des notes
      const totalRatings = book.ratings.length;
      book.averageRating = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      ) / totalRatings;

      // 6️⃣ Sauvegarde du livre avec la nouvelle note et la nouvelle moyenne
      return book.save()
        .then(updatedBook => res.status(201).json({ message: 'Notation enregistrée', book: updatedBook }));
    })
    .catch(error => res.status(500).json({ message: 'Erreur serveur', error }));
};
