const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Consider hashing passwords if adding auth
});

module.exports = mongoose.model('User', userSchema);
