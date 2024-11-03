import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import authService from '../services/authService'; 
import '../styles/SignUp.css';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await authService.signUp(username, password); 
        setMessage(response.message || 'Sign-up successful!');
        alert('Successfully done!');
        navigate('/'); 
    } catch (error) {
        if (error.response?.data?.error.includes("duplicate key error")) {
            setMessage('The username "' + username + '" is already taken. Please choose a different username.');
        } else {
            setMessage(error.response?.data?.error || 'Sign-up failed. Please try again.');
        }
    }
};

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button type="submit" className="btn-signup">Sign Up</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default SignUp;
