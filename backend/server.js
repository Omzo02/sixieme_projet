const http = require('http');
const app = require('./app');

// Définir le port
const PORT = process.env.PORT || 3000;

// Créer et lancer le serveur
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
