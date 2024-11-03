import React from 'react';
import '../styles/VocabularyCard.css';

const VocabularyCard = ({ vocab, onDelete, onUpdate, onIncreaseReview, onDecreaseReview }) => {
  return (
    <div className="vocabulary-card">
      <div className="card-header">
        <h2 className="card-title">{vocab.word}</h2>
        <div>
          <button className="icon-button" onClick={() => onDelete(vocab._id)}>
            <i className="fas fa-trash"></i> 
          </button>
          <button className="icon-button" onClick={() => onUpdate(vocab._id)}>
            <i className="fas fa-cog"></i> 
          </button>
        </div>
      </div>
      <p className="definition"><strong>Definition:</strong> {vocab.definition}</p>
      <p className="example"><strong>Example:</strong> {vocab.exampleSentence}</p>
      <p className="review-score"><strong>Review Score:</strong> {vocab.reviewScore}</p> 
      <div className="review-buttons">
        <button onClick={() => onIncreaseReview(vocab._id)}>
          <i className="fas fa-thumbs-up"></i>
        </button>
        <button onClick={() => onDecreaseReview(vocab._id)}>
          <i className="fas fa-thumbs-down"></i>
        </button>
      </div>
    </div>
  );
};

export default VocabularyCard;
