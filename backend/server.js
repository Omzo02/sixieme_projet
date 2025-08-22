const http = require('http'); // Import du module natif Node.js pour créer un serveur HTTP
const app = require('./app'); // Import de l’application Express configurée dans app.js

// Fonction pour normaliser le port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Convertit en nombre entier
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Port par défaut
const DEFAULT_PORT = 4000; // Port par défaut si aucun n’est précisé

// Fonction de gestion d’erreurs
const errorHandler = (error, server, port) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' nécessite des privilèges élevés.');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(`⚠️ Le port ${port} est déjà utilisé. Tentative sur le port ${port + 1}...`);
      startServer(port + 1); // Redémarrer sur un autre port
      break;
    default:
      throw error;
  }
};

// Fonction pour démarrer le serveur
const startServer = (port) => {
  const normalizedPort = normalizePort(port);
  app.set('port', normalizedPort); // Stocke le port dans Express

  const server = http.createServer(app); // Crée le serveur HTTP avec Express
  
  // Gestion des erreurs
  server.on('error', (error) => errorHandler(error, server, normalizedPort));

  // Quand le serveur est lancé avec succès
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + normalizedPort;
    console.log('🚀 Serveur démarré sur ' + bind);
  });

  server.listen(normalizedPort); // Lance l’écoute du serveur sur le port choisi
};

// Lancement du serveur
startServer(DEFAULT_PORT);
