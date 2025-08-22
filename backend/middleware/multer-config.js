const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Types MIME autorisés pour les images
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Multer en mémoire pour traiter l'image avant de la sauvegarder
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image');

// Middleware pour compresser et sauvegarder l'image
module.exports = (req, res, next) => {
  // Upload de l'image
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    if (req.file) {
      // Création d'un nom unique avec Date.now()
      const filename = `${req.file.originalname.split(' ').join('_').split('.')[0]}_${Date.now()}.webp`;
      const outputPath = path.join('images', filename);

      try {
        // Compression et conversion avec Sharp
        await sharp(req.file.buffer)
          .resize(450, 580)       // Redimensionnement
          .webp({ quality: 80 })  // Conversion en WebP avec qualité 80%
          .toFile(outputPath);

        // Mise à jour de req.file pour la route suivante
        req.file.path = outputPath;
        req.file.filename = filename;
        next(); // Passe au prochain middleware / controller
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    } else {
      next(); // S'il n'y a pas de fichier, continue quand même
    }
  });
};
