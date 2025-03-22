import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/scoreService';
import messages from '../../utils/messages';
import './Leaderboard.css';

const Leaderboard = ({ currentUserId }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard();
        setLeaderboard(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(typeof err.message === 'string' ? err.message : messages.SERVER_ERROR);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="leaderboard-loading">{messages.LOADING}</div>;
  }

  if (error) {
    return <div className="leaderboard-error">{error}</div>;
  }

  // Check if current user is on the leaderboard
  const userEntry = leaderboard.find(item => item.user === currentUserId || item.user._id === currentUserId);
  const isInLeaderboard = !!userEntry;

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">{messages.LEADERBOARD_TITLE}</h2>
      
      {leaderboard.length > 0 ? (
        !isInLeaderboard ? (
          <div className="user-rank-container">
            <p className="user-rank-message">{messages.KEEP_PRACTICING}</p>
          </div>
        ) : null 
      ) : (
        <div className="user-rank-container">
          <p className="user-rank-message">{messages.FIRST_LEADERBOARD}</p>
        </div>
      )}
      
      
      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.user === currentUserId || entry.user._id === currentUserId;
          return (
            <div 
              key={entry.user}
              className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank">#{index + 1}</div>
              <div className="player-name">{entry.firstName}</div>
              <div className="accuracy">{Math.round(entry.averageAccuracy)}%</div>
              <div className="games-played">
                {entry.gamesPlayed} {entry.gamesPlayed === 1 ? messages.GAMES_PLAYED_SINGULAR : messages.GAMES_PLAYED_PLURAL}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;

// Attribution: Claude 3.7 Sonnet and Copilot were used to assist in writing the code.