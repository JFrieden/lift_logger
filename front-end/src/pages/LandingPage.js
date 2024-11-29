// ./pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css'; // Import CSS for styling

const LandingPage = () => {
  const navigate = useNavigate();

  // Navigate to sign-up page
  const handleSignUp = () => {
    navigate('/signup');
  };

  // Navigate to login page
  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="landing-container">
      <header className="header">
        <h1>Lift Logger</h1>
        <p>Track your progress, build your strength, and achieve your fitness goals.</p>
      </header>

      <div className="auth-buttons">
        <button className="button sign-up" onClick={handleSignUp}>Sign Up</button>
        <button className="button login" onClick={handleLogin}>Log In</button>
      </div>
    </div>
  );
};

export default LandingPage;
