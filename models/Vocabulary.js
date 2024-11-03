const mongoose = require('mongoose');

const vocabSchema = new mongoose.Schema({
  word: { type: String, required: true },
  definition: { type: String, required: true },
  exampleSentence: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  reviewScore: { type: Number, default: 0 },
});

module.exports = mongoose.model('Vocabulary', vocabSchema);
