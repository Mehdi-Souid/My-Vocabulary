import React from 'react';
import '../styles/Sidebar.css';
import logo from '../assets/images/logo.png'; 

const Sidebar = ({ onAddClick, onEditProfile, onLogout }) => {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <img src={logo} alt="App Logo" className="sidebar-logo" /> 
      <button onClick={onAddClick}>Add Word</button>
      <button onClick={onEditProfile}>Edit Profile</button>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Sidebar;
