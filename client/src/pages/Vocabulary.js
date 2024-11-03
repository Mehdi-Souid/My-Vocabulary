import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import AddWordForm from '../components/AddWordForm';
import VocabularyCard from '../components/VocabularyCard';
import SuggestedWordCard from '../components/SuggestedWordCard';
import UpdateWordForm from '../components/UpdateWordForm';
import Modal from '../components/Modal'; // Import the Modal component

import '../styles/Vocabulary.css';

const API_URL = 'http://localhost:3000/api/vocab';

const VocabularyContainer = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 
  const [currentWord, setCurrentWord] = useState(null);
  const [suggestedWords, setSuggestedWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const fetchVocabulary = async () => {
      setLoading(true);
      try {
        const userIdFromStorage = localStorage.getItem('userId');
        if (userIdFromStorage) {
          setUserId(userIdFromStorage);
          const response = await axios.get(`${API_URL}?userId=${userIdFromStorage}`);
          setVocabularyList(response.data);
        }
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
        setErrorMessage('An error occurred while fetching vocabulary.');
      } finally {
        setLoading(false);
      }
    };
    fetchVocabulary();
  }, []);

  const fetchSuggestedWords = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/suggestions/${userId}`);
      setSuggestedWords(response.data);
    } catch (error) {
      console.error('Error fetching suggested words:', error);
      setErrorMessage('An error occurred while fetching suggested words.');
    } finally {
      setLoading(false);
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
    window.location.href = `/edit-profile/`;
  };

  const handleAddWord = async (newWordData) => {
    try {
      const response = await axios.post(API_URL, { ...newWordData, userId });
      setVocabularyList([...vocabularyList, response.data]);
      setIsAddModalOpen(false); 
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error adding word:', error);
      setErrorMessage('An error occurred while adding the word.');
    }
  };

  const handleDeleteWord = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setVocabularyList(vocabularyList.filter((vocab) => vocab._id !== id));
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error deleting word:', error);
      setErrorMessage('An error occurred while deleting the word.');
    }
  };

  const handleUpdateWord = (id) => {
    const wordToUpdate = vocabularyList.find((vocab) => vocab._id === id);
    if (wordToUpdate) {
      setCurrentWord(wordToUpdate);
      setIsUpdateModalOpen(true); 
    }
  };

  const handleUpdateWordSubmit = async (id, updatedWordData) => {
    try {
      await axios.put(`${API_URL}/${id}`, updatedWordData);
      setVocabularyList(vocabularyList.map((vocab) =>
        vocab._id === id ? { ...vocab, ...updatedWordData } : vocab
      ));
      setIsUpdateModalOpen(false); 
      setCurrentWord(null);
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error updating word:', error);
      setErrorMessage('An error occurred while updating the word.');
    }
  };

  const handleAddSuggestedWord = async (suggestedWord) => {
    try {
      const response = await axios.post(API_URL, { ...suggestedWord, userId });
      setVocabularyList([...vocabularyList, response.data]);
      fetchSuggestedWords();
    } catch (error) {
      console.error('Error adding suggested word:', error);
      setErrorMessage('An error occurred while adding the suggested word.');
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
      setErrorMessage('An error occurred while increasing the review score.');
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
      setErrorMessage('An error occurred while decreasing the review score.');
    }
  };

  return (
    <div className="vocabulary-container">
      <Sidebar onLogout={handleLogout} onEditProfile={handleEditProfile} onAddClick={() => setIsAddModalOpen(true)} />
      {loading && <p>Loading...</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="vocabulary-content">
        <h2>My Vocabulary</h2>
        
        {/* Add Word Modal */}
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
          <AddWordForm onAddWord={handleAddWord} onCancel={() => setIsAddModalOpen(false)} />
        </Modal>

        {/* Update Word Modal */}
        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
          {currentWord && (
            <UpdateWordForm 
              currentWord={currentWord}
              onUpdate={handleUpdateWordSubmit} 
              onCancel={() => {
                setIsUpdateModalOpen(false);
                setCurrentWord(null);
              }} 
            />
          )}
        </Modal>

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
