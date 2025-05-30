import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, editUser, logout } from '../../services/authService';
import './Homepage.css';
import { generateQuestions } from '../../services/apiService';
import messages from '../../utils/messages';
import { popularTopics } from '../../data/topics';

const UserHomepage = ({ user, setUser }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  // Add this to load the fonts
  useEffect(() => {
    // Load Montserrat and Nunito fonts from Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    // Get fresh user data
    const refreshUserData = async () => {
      try {
        const userData = await getCurrentUser();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
      }
    };

    refreshUserData();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleCard = (id) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleStartGame = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCustomTopic('');
    setIsLoading(false); // Reset loading state when closing modal
  };

  const handleSubmitTopic = async () => {
    setIsLoading(true); // Set loading state to true when submitting

    try {
      // Generate questions from API
      const questions = await generateQuestions(customTopic, 5);

      // If we get questions back (successful API call)
      if (questions && questions.length > 0) {
        // Update local user state to reflect the decremented count
        setUser((prevUser) => ({
          ...prevUser,
          apiCallsRemaining: prevUser.apiCallsRemaining - 1,
        }));

        try {
          await editUser({
            apiCallsCount: user.apiCallsCount + 1,
          });
        } catch (error) {
          console.error('Error updating user data:', error);
        }

        // Navigate to the game screen with the questions
        navigate('/game', {
          state: {
            questions: questions,
            topic: customTopic,
          },
        });
      } else {
        // Handle case when no questions are returned
        setIsLoading(false); // Reset loading state before showing alert
        alert(messages.QUESTIONS_GENERATION_FAILED);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setIsLoading(false); // Reset loading state before showing alert
      alert(messages.QUESTIONS_GENERATION_ERROR);
    }

    // Note: Not calling handleCloseModal here since we navigate on success
    // and reset loading on error
  };

  const handleRandomTopic = () => {
    const randomTopic =
      popularTopics[Math.floor(Math.random() * popularTopics.length)].name;
    setCustomTopic(randomTopic);
  };

  if (!user) {
    return <div className='loading'>{messages.LOADING}</div>;
  }

  return (
    <div className='trivia-homepage'>
      <div className='header'>
        <h1>{messages.APP_TITLE}</h1>
        <div className='user-section'>
          <div className='user-info'>
            <div className='games-played'>
              {messages.GAMES_PLAYED}
              {user.apiCallsCount || 0}
            </div>
            <button id='home-logout' onClick={handleLogout}>
              {messages.LOGOUT}
            </button>
          </div>
          <div className='api-limit'>
            {user.apiCallsCount >= 20 && (
              <span className='warning'>{messages.API_LIMIT_WARNING}</span>
            )}
          </div>
        </div>
      </div>

      <div className='topics-section'>
        <h3>{messages.WELCOME_USER.replace('{name}', user.firstName)}</h3>

        <div className='welcome-section'>
          <button className='start-game-button' onClick={handleStartGame}>
            {messages.START_BUTTON}
          </button>
        </div>
        <div className='topics-grid'>
          {popularTopics.map((topic) => (
            <div
              key={topic.id}
              className={`topic-card ${
                flippedCards[topic.id] ? 'flipped' : ''
              }`}
              style={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
              onClick={() => toggleCard(topic.id)}
            >
              <div
                className='card-inner'
                style={{ background: 'transparent', border: 'none' }}
              >
                <div
                  className='card-front'
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                  }}
                >
                  <h4>{topic.name}</h4>
                </div>
                <div
                  className='card-back'
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                  }}
                >
                  <p>{topic.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className='close-button' onClick={handleCloseModal}>
              ×
            </button>
            <h2>{messages.START_GAME_TITLE}</h2>
            <p>{messages.ENTER_TOPIC_PROMPT}</p>

            <input
              type='text'
              placeholder={messages.TOPIC_INPUT_PLACEHOLDER}
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              disabled={isLoading}
            />

            <div className='modal-buttons'>
              <button onClick={handleRandomTopic} disabled={isLoading}>
                {messages.RANDOM_TOPIC}
              </button>
              <button
                onClick={handleSubmitTopic}
                disabled={!customTopic.trim() || isLoading}
                className={isLoading ? 'loading-button' : ''}
              >
                {isLoading ? (
                  <div className='loading-spinner'>
                    <div className='spinner'></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  messages.START_GAME
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomepage;

// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
