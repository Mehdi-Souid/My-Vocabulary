import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import '../styles/EditProfile.css';
import { FaHome, FaBook } from 'react-icons/fa';

axios.defaults.baseURL = 'http://localhost:3000'; 

const EditProfile = () => {
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); 
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/users/${userId}`); 
        setUsername(response.data.username);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!username) {
      alert("Username cannot be empty");
      return;
    }
    
    if (newPassword && newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }
    
    if (newPassword && newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const userId = localStorage.getItem('userId'); 
      await axios.put(`http://localhost:3000/api/users/${userId}`, {
        username,
        password: currentPassword ? newPassword : null, 
      });
      alert('Profile updated successfully');
      navigate('/vocabulary'); 
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  return (
    <main className="main-background">
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      
      <div className="edit-profile-form">
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        <button className="update-btn" onClick={handleUpdateProfile}>Update Profile</button>
      </div>

      <div className="edit-profile-nav">
        <button className="nav-btn" onClick={() => navigate('/')}>
          <FaHome /> Return Home
        </button>
        <button className="nav-btn" onClick={() => navigate('/vocabulary')}>
          <FaBook /> Return to My Vocabulary
        </button>
      </div>
    </div>
    </main>
  );
};

export default EditProfile;
