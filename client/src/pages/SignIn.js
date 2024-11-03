import React, { useState } from 'react';
import authService from '../services/authService'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/SignIn.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const response = await authService.signIn(username, password); 
      setMessage(response.message || 'Sign-in successful!');

      localStorage.setItem('userId', response.user._id); 

      navigate('/vocabulary'); 
    } catch (error) {
      setMessage(error.response?.data?.error || 'Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>} 
    </div>
  );
};

export default SignIn;
