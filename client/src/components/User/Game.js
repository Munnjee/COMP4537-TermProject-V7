import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Game.css';
import confetti from 'canvas-confetti';
import messages from '../../utils/messages';
import { saveScore as saveScoreAPI } from '../../services/scoreService';
import Leaderboard from './Leaderboard';
import { getCurrentUser } from '../../services/authService';

const Game = () => {
  // Add messages prop
  const location = useLocation();
  const navigate = useNavigate();
  const { questions = [], topic = messages.DEFAULT_TOPIC } =
    location.state || {};

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [streakCount, setStreakCount] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [questionResult, setQuestionResult] = useState(null); // 'correct' or 'wrong'
  const [results, setResults] = useState([]);
  const [isExiting, setIsExiting] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [savedScore, setSavedScore] = useState(false);
  const [user, setUser] = useState(null);

  const timerRef = useRef(null);
  const containerRef = useRef(null);
  const questionProcessedRef = useRef(false);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      setUser(userData);
    };
    
    fetchUser();
  }, []);

  // Check if questions exist, if not, redirect to home
  useEffect(() => {
    if (!location.state || !questions || questions.length === 0) {
      navigate('/');
    }
  }, [location.state, questions, navigate]);

  // Start timer for each question
  useEffect(() => {
    if (gameOver) return;

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeLeft(15);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on unmount or when moving to next question
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, gameOver]);

  // Calculate accuracy and save score when game is over
  useEffect(() => {
    if (gameOver && !savedScore && results.length > 0) {
      const correctAnswers = results.filter((r) => r.isCorrect).length;
      const calculatedAccuracy = Math.round((correctAnswers / questions.length) * 100);
      
      const handleSaveScore = async () => {
        await saveScoreAPI(calculatedAccuracy);
        setSavedScore(true);
      };
      
      handleSaveScore();
    }
  }, [gameOver, savedScore, results, questions.length]);

  // Handle time up scenario
  const handleTimeUp = () => {
    if (!selectedOption && !showFeedback) {
      setShowFeedback(true);
      setQuestionResult('wrong');
      updateResults('timeout');
      setStreakCount(0); // Reset streak

      // Automatically move to next question after 3 seconds
      setTimeout(() => {
        moveToNextQuestion();
      }, 3000);
    }
  };

  const updateResults = (option) => {
    if (!questionProcessedRef.current) {
      questionProcessedRef.current = true;
      setResults((prev) => [
        ...prev,
        {
          question: questions[currentQuestionIndex].question,
          selectedAnswer: option,
          correctAnswer: questions[currentQuestionIndex].correctAnswer,
          isCorrect: option === questions[currentQuestionIndex].correctAnswer,
        },
      ]);
    }
  };

  const handleOptionSelect = (option) => {
    if (showFeedback) return; // Prevent selecting another option after showing feedback

    setSelectedOption(option);
    setShowFeedback(true);

    // Check if answer is correct and update score
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;

    updateResults(option);

    if (isCorrect) {
      setScore((prev) => prev + 20);
      setQuestionResult('correct');
      setStreakCount((prev) => prev + 1);

      // Show streak notification if streak is at least 2
      if (streakCount + 1 >= 2) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1500);
      }

      // Show confetti for correct answers
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: rect.top / window.innerHeight,
          },
        });
      }
    } else {
      setQuestionResult('wrong');
      setStreakCount(0); // Reset streak on wrong answer
    }

    // Move to next question after delay
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // End of quiz
      setIsExiting(true);
      setTimeout(() => {
        setGameOver(true);
        setIsExiting(false);
      }, 500);
    } else {
      // Transition to next question
      setIsExiting(true);
      setTimeout(() => {
        setSelectedOption(null);
        setShowFeedback(false);
        setQuestionResult(null);
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsExiting(false);
        questionProcessedRef.current = false;
      }, 500);
    }
  };

  const handlePlayAgain = () => {
    navigate('/');
  };

  // If no questions or navigated directly, show loading
  if (!questions || questions.length === 0) {
    return <div className='loading-game'>{messages.LOADING_QUIZ}</div>;
  }

  // Game Over Screen
  if (gameOver) {
    const correctAnswers = results.filter((r) => r.isCorrect).length;
    const accuracy = Math.round((correctAnswers / questions.length) * 100);

    return (
      <div className='game-container game-over' ref={containerRef}>
        <div className='results-card'>
          <div className='results-header'>
            <h1>{messages.QUIZ_COMPLETE}</h1>
          </div>

          <div className="results-tabs">
            <button 
              className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
              onClick={() => setActiveTab('results')}
            >
              {messages.RESULTS_TAB}
            </button>
            <button 
              className={`tab-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
               {messages.LEADERBOARD_TAB}
            </button>
          </div>

          {activeTab === 'results' && (
            <div className='topic-badge-container'>
              <div className='topic-badge'>{topic}</div>
            </div>
          )}

          {activeTab === 'results' ? (
            <>
              <div className='score-section'>
                <div className='final-score'>
                  <div className='score-value'>{score}</div>
                  <div className='max-score'>/ {questions.length * 20}</div>
                </div>

                <div className='stats-grid'>
                  <div className='stat-box'>
                    <div className='stat-value'>{correctAnswers}</div>
                    <div className='stat-label'>{messages.CORRECT}</div>
                  </div>
                  <div className='stat-box'>
                    <div className='stat-value'>
                      {questions.length - correctAnswers}
                    </div>
                    <div className='stat-label'>{messages.WRONG}</div>
                  </div>
                  <div className='stat-box'>
                    <div className='stat-value'>{accuracy}%</div>
                    <div className='stat-label'>{messages.ACCURACY}</div>
                  </div>
                </div>
              </div>

              <div className='questions-review'>
                <h3>{messages.QUESTION_REVIEW}</h3>
                <div className='review-list'>
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`review-item ${
                        result.isCorrect ? 'correct' : 'wrong'
                      }`}
                    >
                      <div className='review-number'>{index + 1}</div>
                      <div className='review-content'>
                        <div className='review-question'>{result.question}</div>
                        <div className='review-answers'>
                          {result.isCorrect ? (
                            <span className='review-correct'>
                              {messages.CORRECT_ANSWER_FEEDBACK}
                            </span>
                          ) : result.selectedAnswer === 'timeout' ? (
                            <span className='review-wrong'>
                              {messages.TIMEOUT_FEEDBACK} {result.correctAnswer}
                            </span>
                          ) : (
                            <span className='review-wrong'>
                              {messages.YOU_ANSWERED}{' '}
                              <span className='selected'>
                                {result.selectedAnswer}
                              </span>
                              &nbsp;&nbsp; &nbsp;&nbsp;{messages.CORRECT_ANSWER}{' '}
                              <span className='correct-text'>
                                {result.correctAnswer}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Leaderboard currentUserId={user?._id} />
          )}

          <button className='play-again-btn' onClick={handlePlayAgain}>
            <span className='btn-icon'>🏠</span>
            {messages.BACK_TO_HOME}
          </button>
        </div>
      </div>
    );
  }

  // Current Question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      className={`game-container ${isExiting ? 'exiting' : 'entering'}`}
      ref={containerRef}
    >
      <div className='game-header'>
        <div className='header-top'>
          <div className='topic-indicator'>
            <span className='topic-icon'>🎲</span>
            <span className='topic-text'>{topic}</span>
          </div>

          <div className='progress-indicator'>
            <div className='progress-text'>
              {currentQuestionIndex + 1}/{questions.length}
            </div>
            <div className='progress-bar'>
              <div
                className='progress-fill'
                style={{
                  width: `${
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className='score-container'>
          <div className='score-label'>{messages.SCORE}</div>
          <div className='score-value'>{score}</div>
        </div>
      </div>

      {showStreak && streakCount >= 2 && (
        <div className='streak-notification'>
          <span className='streak-icon'>🔥</span>
          <span className='streak-text'>
            {messages.STREAK_MESSAGE.replace('{count}', streakCount)}
          </span>
        </div>
      )}

      <div className='timer-wrapper'>
        <div className='timer-label'>{messages.TIME_LEFT}</div>
        <div className='timer-container'>
          <div
            className={`timer ${timeLeft <= 5 ? 'timer-warning' : ''}`}
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
        <div className='timer-seconds'>{timeLeft}s</div>
      </div>

      <div
        className={`question-card ${
          questionResult ? `question-${questionResult}` : ''
        }`}
      >
        <h2 className='question-text'>{currentQuestion?.question}</h2>

        <div className='options-grid'>
          {currentQuestion?.options.map((option, index) => (
            <button
              key={index}
              className={`game-option ${
                showFeedback
                  ? option === currentQuestion.correctAnswer
                    ? 'option-correct'
                    : selectedOption === option
                    ? 'option-incorrect'
                    : ''
                  : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              disabled={showFeedback}
            >
              <div className='option-content'>
                <span className='option-letter'>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className='option-text'>{option}</span>
              </div>

              {showFeedback && (
                <div className='option-indicator'>
                  {option === currentQuestion.correctAnswer && (
                    <span className='check-icon'>✓</span>
                  )}
                  {selectedOption === option &&
                    option !== currentQuestion.correctAnswer && (
                      <span className='cross-icon'>✗</span>
                    )}
                </div>
              )}
            </button>
          ))}
        </div>

        {showFeedback && (
          <div className={`feedback-banner ${questionResult}`}>
            {questionResult === 'correct' ? (
              <>
                <span className='feedback-icon'>🎉</span>
                <span className='feedback-text'>{messages.CORRECT_POINTS}</span>
              </>
            ) : selectedOption ? (
              <>
                <span className='feedback-icon'>❌</span>
                <span className='feedback-text'>
                  {messages.INCORRECT_ANSWER} {currentQuestion.correctAnswer}
                </span>
              </>
            ) : (
              <>
                <span className='feedback-icon'>⏰</span>
                <span className='feedback-text'>
                  {messages.TIMES_UP} {currentQuestion.correctAnswer}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
// Attribution: ChatGPT was used for structure and organization of the code and Copilot was used to assist in writing the code.
