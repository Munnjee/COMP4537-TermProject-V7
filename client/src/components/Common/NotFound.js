import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';
import messages from '../../utils/messages';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404</h1>
        <h2>{messages.PAGE_NOT_FOUND_TITLE}</h2>
        <p>{messages.PAGE_NOT_FOUND}</p>
        <Link to="/" className="home-button">
          {messages.RETURN_HOME}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.