import React, { useEffect, useState } from "react";
import { useInterview } from "../hooks/useInterview";
import "./History.scss";

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const History = () => {
  const { fetchVoiceSessions, sessions, loading } = useInterview();
  const [selectedSession, setSelectedSession] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    document.title = "PrepForge AI | Interview History";
    fetchVoiceSessions();
  }, []);

  const toggleQuestion = (qIndex) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [qIndex]: !prev[qIndex]
    }));
  };

  const handleSpeakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading && (!sessions || sessions.length === 0)) {
    return (
      <main className="history-page">
        <div className="history-container">
          <h2>Loading your Interview History...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="history-page">
      <div className="history-container">
        <header className="history-header">
          <div>
            <h1>Interview History & Reports</h1>
            <p>Review past completed mock interviews, detailed answer transcripts, scores, and AI feedback.</p>
          </div>
        </header>

        {(!sessions || sessions.length === 0) ? (
          <div className="empty-history-card">
            <div className="empty-icon">📜</div>
            <h3>No Completed Mock Interviews Yet</h3>
            <p>Take your first AI voice mock interview to generate session reports and track your progress over time.</p>
          </div>
        ) : (
          <div className="history-layout">
            {/* Sidebar list of completed sessions */}
            <aside className="sessions-list-sidebar">
              <h3>Past Completed Sessions</h3>
              <div className="sessions-scroll">
                {sessions.map((sess) => {
                  const isSelected = selectedSession?._id === sess._id;
                  const dateStr = sess.createdAt ? new Date(sess.createdAt).toLocaleDateString() : "Recently";
                  return (
                    <div
                      key={sess._id}
                      className={`session-card-item ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSession(sess);
                        setExpandedQuestions({});
                      }}
                    >
                      <div className="card-top">
                        <strong className="session-role">{sess.roleTitle || "Software Engineer"}</strong>
                        <span className={`score-pill ${sess.overallScore >= 75 ? "high" : sess.overallScore >= 60 ? "mid" : "low"}`}>
                          {sess.overallScore ?? 0}/100
                        </span>
                      </div>
                      <div className="card-bottom">
                        <span>{dateStr}</span>
                        <small>{sess.questions?.length || 0} Questions</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* Session Detail Content */}
            <section className="session-detail-view">
              {selectedSession ? (
                <div className="detail-card">
                  <div className="detail-header">
                    <div>
                      <h2>{selectedSession.roleTitle}</h2>
                      <span className="date-tag">
                        Interviewed on {new Date(selectedSession.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="score-summary">
                      <span className="score-number">{selectedSession.overallScore ?? 0}</span>
                      <small>/ 100 Overall</small>
                    </div>
                  </div>

                  {selectedSession.observedWeaknesses?.length > 0 && (
                    <div className="observed-weaknesses-box">
                      <h4>Observed Interview Weaknesses</h4>
                      <ul>
                        {selectedSession.observedWeaknesses.map((w, idx) => (
                          <li key={idx}>⚠️ {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="questions-breakdown">
                    <h3>Question-Level Evaluation</h3>
                    {selectedSession.questions?.map((q, idx) => {
                      const isOpen = !!expandedQuestions[idx];
                      return (
                        <div key={idx} className="question-review-item">
                          <div className="review-header" onClick={() => toggleQuestion(idx)}>
                            <div className="header-left">
                              <span className="q-badge">Q{idx + 1}</span>
                              <strong className="q-title">{q.question}</strong>
                            </div>

                            <div className="header-right">
                              <span className={`q-score ${q.score >= 8 ? "high" : q.score >= 6 ? "mid" : "low"}`}>
                                Score {q.score}/10
                              </span>
                              <button className="expand-btn">{isOpen ? "Hide" : "View Answer"}</button>
                            </div>
                          </div>

                          {isOpen && (
                            <div className="review-body">
                              <div className="body-block">
                                <strong>Your Spoken Answer Transcript:</strong>
                                <p className="user-answer-text">"{q.userAnswer || "No answer recorded."}"</p>

                                <button
                                  className="replay-btn"
                                  onClick={() => handleSpeakText(q.userAnswer || q.question)}
                                >
                                  <PlayIcon /> Replay Audio Transcribe
                                </button>
                              </div>

                              {q.feedback && (
                                <div className="body-block">
                                  <strong>AI Evaluator Feedback:</strong>
                                  <p className="feedback-text">{q.feedback}</p>
                                </div>
                              )}

                              {q.suggestedAnswer && (
                                <div className="body-block">
                                  <strong>Suggested High-Score Answer:</strong>
                                  <p className="suggested-text">{q.suggestedAnswer}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="select-prompt-card">
                  <p>👈 Select an interview session from the list to view full question-level reports and transcripts.</p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default History;
