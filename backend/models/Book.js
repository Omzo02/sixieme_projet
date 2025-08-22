const mongoose = require('mongoose'); // Importation de Mongoose pour interagir avec MongoDB

const bookSchema = mongoose.Schema({ // Définition du schéma Book (la structure des documents "livres" dans MongoDB)
  userId: { type: String, required: true }, // L'ID de l'utilisateur qui a créé le livre
  title: { type: String, required: true },  // Le titre du livre
  author: { type: String, required: true }, // L'auteur du livre
  imageUrl: { type: String, required: true }, // L’URL de l’image associée au livre (hébergée dans /images)
  year: { type: Number, required: true }, // Année de publication
  genre: { type: String, required: true }, // Le genre litéraire
  // Tableau des notations (chaque utilisateur peut donner une note)
  ratings: [
    {
      userId: { type: String, required: true }, // Qui a noté
      grade: { type: Number, required: true, min: 0, max: 5 } // La note donnée (entre 0 et 5)
    }
  ],
  // Moyenne des notes (calculée automatiquement dans le controller lors de l’ajout d’une note)
  averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Book', bookSchema);
