const express = require('express');
const router = express.Router();
const vocabController = require('../controllers/vocabController');

// Add a new word
router.post('/vocab', vocabController.addWord);

// Get all words for a user with userId as query param
router.get('/vocab', vocabController.getWords);

// Update a word by ID
router.put('/vocab/:id', vocabController.updateWord);

// Delete a word by ID
router.delete('/vocab/:id', vocabController.deleteWord);

// Get suggested words based on user level (changed to userId for consistency)
router.get('/vocab/suggestions/:userId', vocabController.getSuggestedWords);

module.exports = router;
