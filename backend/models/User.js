const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); // Empêche qu'un utilsateur s'inscrive plusieurs fois avec le même email

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Champ email : obligatoire (required: true) et doit être unique dans la base.
  password: { type: String, required: true } // Le mot de passe sera stocké sous forme de hash (pas en clair).
});

userSchema.plugin(uniqueValidator); // On applique le plugin au schéma → il va renforcer la validation "unique" 

module.exports = mongoose.model('User', userSchema);