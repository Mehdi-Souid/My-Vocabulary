// vocabController.js
const Vocabulary = require('../models/Vocabulary');
const axios = require('axios');

// Add new word
exports.addWord = async (req, res) => {
  try {
    const { word, definition, exampleSentence, userId, reviewScore = 1 } = req.body;
    const newWord = new Vocabulary({ word, definition, exampleSentence, userId, reviewScore });
    await newWord.save();
    res.status(201).json(newWord);
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(400).json({ message: "Error adding word", error });
  }
};

// Get all words for a user
exports.getWords = async (req, res) => {
  try {
    const { userId } = req.query;
    const words = await Vocabulary.find({ userId });
    res.status(200).json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ message: "Error fetching words", error });
  }
};

// Update word's details
exports.updateWord = async (req, res) => {
  try {
    const updatedWord = await Vocabulary.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedWord);
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(400).json({ message: "Error updating word", error });
  }
};

// Delete a word
exports.deleteWord = async (req, res) => {
  try {
    await Vocabulary.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ message: "Error deleting word", error });
  }
};

// Get suggested words with review score of 1-2 for user

exports.getSuggestedWords = async (req, res) => {
  try {
    const { userId } = req.params;
    const SUGGESTION_LIMIT = 10;

    // Step 1: Fetch words with a review score of 1-2 for this user
    const lowScoreWords = await Vocabulary.find({ userId, reviewScore: { $lte: 2 } });
    if (!lowScoreWords.length) {
      return res.json([]); // Return an empty array if no low-score words found
    }

    const baseWords = lowScoreWords.map(word => word.word);

    // Step 2: Calculate suggestions per word
    const suggestionsPerWord = Math.floor(SUGGESTION_LIMIT / baseWords.length);
    const extraSuggestions = SUGGESTION_LIMIT % baseWords.length;

    let allSuggestions = [];

    // Step 3: Use Promise.all to fetch suggestions concurrently
    await Promise.all(
      baseWords.map(async (word, index) => {
        const limitForThisWord = suggestionsPerWord + (index < extraSuggestions ? 1 : 0);

        try {
          const response = await axios.get(`https://api.datamuse.com/words?ml=${word}&max=${limitForThisWord}`);
          const wordSuggestions = response.data.map(item => item.word);

          // Step 4: Fetch definitions for each suggested word concurrently
          const enrichedSuggestions = await Promise.all(
            wordSuggestions.map(async (suggestedWord) => {
              try {
                const definitionResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${suggestedWord}`);
                const definition = definitionResponse.data[0]?.meanings[0]?.definitions[0]?.definition || 'Definition not found';
                
                return { word: suggestedWord, definition, reviewScore: 1 };
              } catch (error) {
                console.error(`Error fetching definition for ${suggestedWord}:`, error.message);
                return { word: suggestedWord, definition: 'Definition not found', reviewScore: 1 };
              }
            })
          );

          allSuggestions.push(...enrichedSuggestions);
        } catch (error) {
          console.error(`Error fetching suggestions for ${word}:`, error.message);
        }
      })
    );

    res.json(allSuggestions);
  } catch (error) {
    console.error('Error fetching suggested words:', error);
    res.status(500).send('Failed to fetch suggested words');
  }
};



