import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AddWordForm.css';

const AddWordForm = ({ onAddWord, onCancel }) => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');

  // Function to fetch definition from the provided API
  const handleGenerateDefinition = async () => {
    try {
      const definitionResponse = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const meanings = definitionResponse.data[0].meanings;
      const definitionsList = meanings.map(meaning => meaning.definitions[0].definition);
      const exampleSentenceList = meanings.map(meaning => meaning.definitions[0].example);

      setDefinition(definitionsList[0] || 'No definition found');
      setExampleSentence(exampleSentenceList[0] || '');
    } catch (error) {
      console.error('Error generating definition:', error);
      setDefinition('Error fetching definition');
      setExampleSentence('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWord({ word, definition, exampleSentence });
    setWord('');
    setDefinition('');
    setExampleSentence('');
  };

  return (
    <div className="add-word-container">
      <h2>Add a New Word</h2>
      <form onSubmit={handleSubmit} className="add-word-form">
        <div>
          <label>Word:</label>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Definition:</label>
          <input
            type="text"
            value={definition}
            readOnly
          />
          <button type="button" onClick={handleGenerateDefinition} className="generate-definition">
            Generate Definition
          </button>
        </div>
        <div>
          <label>Example Sentence:</label>
          <input
            type="text"
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
          />
        </div>
        <button type="submit" className="submit">Add Word</button>
        <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default AddWordForm;
