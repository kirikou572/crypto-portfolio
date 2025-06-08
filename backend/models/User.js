import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const CryptoSchema = new mongoose.Schema({
  symbol:   { type: String, required: true },
  amount:   { type: Number, required: true },
  buyPrice: { type: Number, required: true }
});

const UserSchema = new mongoose.Schema({
  email:        { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  portfolio:    { type: [CryptoSchema], default: [] }
});

// Méthode pour vérifier le mot de passe
UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

// Avant sauvegarde, hash du mot de passe
UserSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

export default mongoose.model('User', UserSchema);
