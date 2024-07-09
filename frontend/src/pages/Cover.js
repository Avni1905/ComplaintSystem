import React from 'react';
import { Link } from 'react-router-dom';
import './Cover.css';

function Cover() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>IT COMPLAINT SYSTEM</h1>
        <div className="button-container">
          <Link to="/login">
            <button className="login-button">Login</button>
          </Link>
          <Link to="/signup">
            <button className="signup-button">Sign Up</button>
          </Link>
        </div>
      </header>
    </div>
  );
}

export default Cover;