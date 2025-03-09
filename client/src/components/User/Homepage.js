// client/src/components/User/Homepage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from "../../services/authService";
import "./Homepage.css";

const popularTopics = [
  {
    id: 1,
    name: "History",
    question: "Who was the first president of the United States?",
  },
  { id: 2, name: "Science", question: "What is the chemical symbol for gold?" },
  {
    id: 3,
    name: "Movies",
    question: "Which film won the Oscar for Best Picture in 2020?",
  },
  { id: 4, name: "Geography", question: "What is the capital of Australia?" },
  {
    id: 5,
    name: "Sports",
    question: "Which team has won the most Super Bowls?",
  },
  { id: 6, name: "Music", question: "Who is known as the 'King of Pop'?" },
  { id: 7, name: "Literature", question: "Who wrote 'Pride and Prejudice'?" },
  { id: 8, name: "Food", question: "What country is sushi from?" },
  { id: 9, name: "Technology", question: "Who founded Apple Inc.?" },
  { id: 10, name: "Animals", question: "What is the fastest land animal?" },
  { id: 11, name: "Art", question: "Who painted the Mona Lisa?" },
  {
    id: 12,
    name: "Space",
    question: "Which planet is known as the Red Planet?",
  },
];

const UserHomepage = ({ user, setUser }) => {
  const [flippedCards, setFlippedCards] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const navigate = useNavigate();

  // Add this to load the fonts
  useEffect(() => {
    // Load Montserrat and Nunito fonts from Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap";
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
        console.error("Error refreshing user data:", error);
      }
    };

    refreshUserData();
  }, [setUser]);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
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
    setCustomTopic("");
  };

  const handleSubmitTopic = () => {
    // Here you would handle the submission of the custom topic
    console.log("Starting game with topic:", customTopic);
    // Navigate to game or start game logic
    handleCloseModal();
  };

  const handleRandomTopic = () => {
    const randomTopic =
      popularTopics[Math.floor(Math.random() * popularTopics.length)].name;
    setCustomTopic(randomTopic);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="trivia-homepage">
      <div className="header">
        <h1>Trivia Generator</h1>
        <div className="user-info">
          <div className="games-remaining">
            Free Games Today: {user.apiCallsRemaining || 0}
          </div>
          <button id="home-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="topics-section">
        <h3>Hi, {user.firstName}! Ready for a TRIVIA?</h3>
        <div className="topics-grid">
          {popularTopics.map((topic) => (
            <div
              key={topic.id}
              className={`topic-card ${
                flippedCards[topic.id] ? "flipped" : ""
              }`}
              style={{
                background: "transparent",
                border: "none",
                boxShadow: "none",
              }}
              onClick={() => toggleCard(topic.id)}
            >
              <div
                className="card-inner"
                style={{ background: "transparent", border: "none" }}
              >
                <div
                  className="card-front"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    position: "absolute",
                  }}
                >
                  <h4>{topic.name}</h4>
                </div>
                <div
                  className="card-back"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    position: "absolute",
                  }}
                >
                  <p>{topic.question}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="welcome-section">
        <button className="start-game-button" onClick={handleStartGame}>
          Start Game
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              ×
            </button>
            <h2>Start a Trivia Game</h2>
            <p>Enter a topic or choose from popular options:</p>

            <input
              type="text"
              placeholder="Enter your topic..."
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />

            <div className="modal-buttons">
              <button onClick={handleRandomTopic}>Random Topic</button>
              <button
                onClick={handleSubmitTopic}
                disabled={!customTopic.trim()}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHomepage;
