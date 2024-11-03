import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Greeting */}
      <h1 className="home-greeting">Welcome to Vocabulary Quest</h1>
      
      {/* Description */}
      <p className="home-description">
        Build your vocabulary, track progress, and quiz yourself to master new words. Play, learn, and achieve your word goals!
      </p>
      
      {/* Buttons */}
      <div className="home-buttons">
        <Link to="/signup" className="btn signup-button">Sign Up</Link>
        <Link to="/signin" className="btn signin-button">Sign In</Link>
      </div>
    
      {/* Game Button */}
      <div className="game-container">
        <a 
          href="https://contexto.me" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-game"
        >
          🕹️ Play "Find the Closest Match!"
        </a>
      </div>
    </div>
  );
};

export default Home;
