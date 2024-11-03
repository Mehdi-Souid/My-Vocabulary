import React, { useEffect, useState } from 'react';
import '../styles/UpdateWordForm.css';

const UpdateWordForm = ({ currentWord, onUpdate, onCancel }) => {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');

  useEffect(() => {
    if (currentWord) {
      setWord(currentWord.word);
      setDefinition(currentWord.definition);
      setExampleSentence(currentWord.exampleSentence);
    }
  }, [currentWord]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentWord) {
      onUpdate(currentWord._id, { word, definition, exampleSentence });
    }
  };

  return (
    <div className="update-word-form">
      <h2>Update Word</h2> {/* Add title */}
      <form onSubmit={handleSubmit}>
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
          <textarea
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
            required
            rows="4" // Adjust number of rows as needed
          />
        </div>
        <div>
          <label>Example Sentence:</label>
          <textarea
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
            required
            rows="4" // Adjust number of rows as needed
          />
        </div>
        <button type="submit">Update Word</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default UpdateWordForm;
