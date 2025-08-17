README - Projet 6
Ce document décrit la démarche pour installer, configurer et tester le projet 6. Il s’agit d’une application web basée sur Node.js, Express et MongoDB, avec un frontend React.
Prérequis
- Node.js (version >= 16)
- npm ou yarn
- MongoDB Atlas ou instance MongoDB locale
- Git
Installation
1. Clonez le dépôt :
git clone https://github.com/votre-utilisateur/sixieme_projet.git
2. Accédez au dossier du projet :
cd sixieme_projet
3. Installez les dépendances pour le backend et le frontend :
cd backend && npm install
cd ../frontend && npm install
Configuration des variables d'environnement
Dans le dossier `backend`, créez un fichier `.env` avec les informations suivantes :

MONGO_URI=Votre_URL_MongoDB
JWT_SECRET=Votre_Clé_Secrète
PORT=4000
Lancer l'application
1. Démarrez le backend :
cd backend && npm start
2. Démarrez le frontend :
cd frontend && npm start
Le backend tourne par défaut sur http://localhost:4000 et le frontend sur http://localhost:3000.
Tests
- Créez un compte utilisateur depuis le frontend (route /Connexion ou /Inscription).
- Connectez-vous et récupérez un token JWT.
- Vérifiez l’ajout, la modification, la suppression et la notation des livres.
- Vérifiez également l’upload d’images avec Multer.
Notes complémentaires
- Le dossier `node_modules` est ignoré via `.gitignore` et ne doit pas être poussé sur le dépôt distant.
- Vous pouvez utiliser `nodemon` en développement pour recharger automatiquement le backend.
- Les images uploadées sont stockées dans le dossier `/images`.
<img width="432" height="629" alt="image" src="https://github.com/user-attachments/assets/b00ae98c-1de1-4269-84ae-59eb60e3a4b8" />
