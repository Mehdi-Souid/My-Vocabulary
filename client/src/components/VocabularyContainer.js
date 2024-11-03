import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import AddWordForm from './AddWordForm';
import VocabularyCard from './VocabularyCard';
import SuggestedWordCard from './SuggestedWordCard';
import UpdateWordForm from './UpdateWordForm';
import '../styles/VocabularyContainer.css';

const API_URL = 'http://localhost:3000/api/vocab';

const VocabularyContainer = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [currentWord, setCurrentWord] = useState(null); 
  const [suggestedWords, setSuggestedWords] = useState([]);

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          setUserId(userIdFromStorage);
          const response = await axios.get(`${API_URL}?userId=${userIdFromStorage}`);
          setVocabularyList(response.data);
        }
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
      }
    };
    fetchVocabulary();
  }, []);

  const fetchSuggestedWords = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`${API_URL}/suggestions/${userId}`);
      setSuggestedWords(response.data);
    } catch (error) {
      console.error('Error fetching suggested words:', error);
    }
  };

  useEffect(() => {
    fetchSuggestedWords();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const handleEditProfile = () => {
    window.location.href = `/edit-profile/${userId}`;
  };

  const handleAddWord = async (newWordData) => {
    try {
      const response = await axios.post(API_URL, { ...newWordData, userId });
      setVocabularyList([...vocabularyList, response.data]);
      setShowAddForm(false);
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVocabularyList(vocabularyList.filter((vocab) => vocab._id !== id));
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  const handleUpdateWord = (id) => {
    const wordToUpdate = vocabularyList.find(vocab => vocab._id === id);
    if (wordToUpdate) {
      setCurrentWord(wordToUpdate); 
      setShowUpdateForm(true); 
    }
  };

  const handleUpdateWordSubmit = async (id, updatedWordData) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedWordData);
      setVocabularyList(vocabularyList.map((vocab) =>
        vocab._id === id ? { ...vocab, ...updatedWordData } : vocab
      ));
      setShowUpdateForm(false);
      setCurrentWord(null); 
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const handleAddSuggestedWord = async (suggestedWord) => {
    try {
      const response = await axios.post(API_URL, { ...suggestedWord, userId });
      setVocabularyList([...vocabularyList, response.data]);
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error adding suggested word:', error);
    }
  };

  const handleIncreaseReview = async (id) => {
    try {
      const vocabItem = vocabularyList.find((vocab) => vocab._id === id);
      if (vocabItem && vocabItem.reviewScore < 5) {
        const updatedScore = vocabItem.reviewScore + 1;
        await axios.put(`${API_URL}/${id}`, { reviewScore: updatedScore });
        setVocabularyList(vocabularyList.map((vocab) =>
          vocab._id === id ? { ...vocab, reviewScore: updatedScore } : vocab
        ));
      }
    } catch (error) {
      console.error('Error increasing review score:', error);
    }
  };

  const handleDecreaseReview = async (id) => {
    try {
      const vocabItem = vocabularyList.find((vocab) => vocab._id === id);
      if (vocabItem && vocabItem.reviewScore > 1) {
        const updatedScore = vocabItem.reviewScore - 1;
        await axios.put(`${API_URL}/${id}`, { reviewScore: updatedScore });
        setVocabularyList(vocabularyList.map((vocab) =>
          vocab._id === id ? { ...vocab, reviewScore: updatedScore } : vocab
        ));
      }
    } catch (error) {
      console.error('Error decreasing review score:', error);
    }
  };

  return (
    <div className="vocabulary-container">
      <Sidebar onLogout={handleLogout} onEditProfile={handleEditProfile} onAddClick={() => setShowAddForm(true)} />

      <div className="vocabulary-content">
        <h2>Your Vocabulary</h2>
        
        {/* Modal for Add Word Form */}
        {showAddForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AddWordForm onAddWord={handleAddWord} onCancel={() => setShowAddForm(false)} />
            </div>
          </div>
        )}

        {/* Modal for Update Word Form */}
        {showUpdateForm && currentWord && (
          <div className="modal-overlay">
            <div className="modal-content">
              <UpdateWordForm 
                currentWord={currentWord} 
                onUpdate={handleUpdateWordSubmit} 
                onCancel={() => {
                  setShowUpdateForm(false);
                  setCurrentWord(null);
                }} 
              />
            </div>
          </div>
        )}

        <div className="vocabulary-cards">
          {vocabularyList.map((vocab) => (
            <VocabularyCard 
              key={vocab._id} 
              vocab={vocab} 
              onDelete={handleDeleteWord} 
              onUpdate={handleUpdateWord} 
              onIncreaseReview={handleIncreaseReview} 
              onDecreaseReview={handleDecreaseReview} 
            />
          ))}
        </div>

        {suggestedWords.length > 0 && (
          <div className="suggested-words">
            <h2>Suggested Words</h2>
            {suggestedWords.map((suggestedWord) => (
              <SuggestedWordCard key={suggestedWord.word} suggestedWord={suggestedWord} onAdd={handleAddSuggestedWord} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyContainer;
