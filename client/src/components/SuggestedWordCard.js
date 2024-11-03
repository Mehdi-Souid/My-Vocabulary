import React from 'react';
import '../styles/SuggestedWordCard.css';

const SuggestedWordCard = ({ suggestedWord, onAdd }) => {
  return (
    <div className="suggested-word-card">
      <h3>{suggestedWord.word}</h3>
      <p><strong>Definition:</strong> {suggestedWord.definition}</p>
      <button onClick={() => onAdd(suggestedWord)}>Add to Vocabulary</button>
    </div>
  );
};

export default SuggestedWordCard;
