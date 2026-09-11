import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInterview } from "../hooks/useInterview";
import "./InterviewVoice.scss";

const MicIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="2"/>
  </svg>
);

const VolumeIcon = ({ isMuted }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {isMuted ? (
      <>
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
      </>
    ) : (
      <>
        <path d="M11 5L6 9H2v6h4l5 4V5z"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
      </>
    )}
  </svg>
);

const InterviewVoice = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {
    startVoiceSession,
    submitVoiceAnswer,
    completeVoiceSession,
    fetchVoiceSessionById,
    activeSession,
    loading
  } = useInterview();

  const [roleTitle, setRoleTitle] = useState("Full Stack Developer");
  const [userTranscript, setUserTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [browserSupported, setBrowserSupported] = useState(true);

  const recognitionRef = useRef(null);

  // Initialize or fetch session
  useEffect(() => {
    document.title = "PrepForge AI | Voice Mock Interview";
    if (sessionId) {
      fetchVoiceSessionById({ sessionId });
    }
  }, [sessionId]);

  // Check browser SpeechRecognition support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupported(false);
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
          setUserTranscript(currentTranscript.trim());
        };

        rec.onerror = (err) => {
          console.error("Speech recognition error:", err);
          setIsListening(false);
          if (err.error === "not-allowed") {
            setErrorMessage("Microphone access was denied. You can type your response below.");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.error("Error setting up SpeechRecognition", err);
        setBrowserSupported(false);
      }
    }
  }, []);

  // Current active question
  const currentQuestion = activeSession?.questions?.[activeSession.questions.length - 1];

  // Speak AI question when it changes
  useEffect(() => {
    if (currentQuestion && currentQuestion.question && !isMuted && !evaluation) {
      speakText(currentQuestion.question);
    }
  }, [currentQuestion?.question, isMuted, evaluation]);

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setErrorMessage("");
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      setUserTranscript("");
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error("Start recording error", e);
          setIsListening(false);
        }
      } else {
        setErrorMessage("Voice speech recognition is not supported in this browser. Please type your answer below.");
      }
    }
  };

  const handleStartNewSession = async () => {
    try {
      const data = await startVoiceSession({ roleTitle });
      setEvaluation(null);
      setUserTranscript("");
      setSessionCompleted(false);
      if (data?.session?._id) {
        navigate(`/interview-voice/${data.session._id}`);
      }
    } catch (err) {
      setErrorMessage("Failed to start voice interview session.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    if (!activeSession) return;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const result = await submitVoiceAnswer({
        sessionId: activeSession._id,
        userAnswer: userTranscript.trim() || "No response provided."
      });

      setEvaluation(result.evaluation);
      if (result.sessionCompleted) {
        setSessionCompleted(true);
      }
    } catch (err) {
      setErrorMessage("Failed to evaluate answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setEvaluation(null);
    setUserTranscript("");
  };

  const handleFinishInterview = async () => {
    if (activeSession) {
      await completeVoiceSession({ sessionId: activeSession._id });
    }
    setSessionCompleted(true);
  };

  if (!activeSession && !loading) {
    return (
      <main className="voice-page-wrapper">
        <div className="voice-setup-card">
          <div className="voice-header">
            <div className="mic-badge">
              <MicIcon />
            </div>
            <h1>Voice Mock Interview</h1>
            <p>
              Experience an interactive AI voice interview. The AI will read questions out loud, listen to your spoken answer, evaluate your performance, and dynamically adjust question difficulty.
            </p>
          </div>

          <div className="role-input-group">
            <label htmlFor="roleTitle">Target Role Position</label>
            <input
              type="text"
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="e.g. Full Stack Developer, Data Analyst, Software Engineer"
            />
          </div>

          {!browserSupported && (
            <div className="voice-warning-box">
              ⚠️ Note: Web Speech Recognition API is not supported in your current browser. You can still participate fully using text input for your answers!
            </div>
          )}

          <button className="start-btn" onClick={handleStartNewSession}>
            <MicIcon /> Start Interactive Voice Session
          </button>
        </div>
      </main>
    );
  }

  const answeredCount = (activeSession?.questions || []).filter(q => q.userAnswer).length;
  const totalQuestions = activeSession?.questions?.length || 1;

  return (
    <main className="voice-page-wrapper">
      <div className="voice-container">
        {/* Top Header */}
        <header className="voice-header-bar">
          <div className="session-info">
            <span className="role-tag">{activeSession?.roleTitle}</span>
            <span className="question-counter">
              Question {totalQuestions} of {sessionCompleted ? totalQuestions : 4}
            </span>
          </div>

          <div className="header-actions">
            <button
              className={`sound-toggle ${isMuted ? "muted" : ""}`}
              onClick={() => {
                setIsMuted(!isMuted);
                if (!isMuted && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={isMuted ? "Unmute AI Voice" : "Mute AI Voice"}
            >
              <VolumeIcon isMuted={isMuted} />
              <span>{isMuted ? "Muted" : "Voice Active"}</span>
            </button>

            <button className="finish-btn" onClick={handleFinishInterview}>
              End Interview
            </button>
          </div>
        </header>

        {sessionCompleted ? (
          /* Session Completed Summary View */
          <div className="completed-summary-card">
            <div className="completion-badge">🏆</div>
            <h2>Interview Session Completed!</h2>
            <p>Great job completing your mock interview session for <strong>{activeSession?.roleTitle}</strong>.</p>

            <div className="score-banner">
              <div className="big-score">{activeSession?.overallScore ?? 0}</div>
              <div className="score-text">
                <strong>Overall Performance Score</strong>
                <span>Based on {activeSession?.questions?.length || 0} evaluated interview questions</span>
              </div>
            </div>

            <div className="evaluated-questions-list">
              <h3>Question Performance Breakdown</h3>
              {activeSession?.questions?.map((q, idx) => (
                <div key={idx} className="evaluated-item">
                  <div className="eval-item-header">
                    <span className="q-num">Q{idx + 1}</span>
                    <strong className="q-text">{q.question}</strong>
                    <span className={`score-badge ${q.score >= 8 ? "high" : q.score >= 6 ? "mid" : "low"}`}>
                      {q.score}/10
                    </span>
                  </div>

                  <div className="user-ans-block">
                    <small>Your Spoken Answer:</small>
                    <p>"{q.userAnswer}"</p>
                  </div>

                  {q.feedback && (
                    <div className="feedback-block">
                      <small>AI Feedback:</small>
                      <p>{q.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="action-row">
              <button className="action-btn primary" onClick={handleStartNewSession}>
                Start New Session
              </button>
              <button className="action-btn secondary" onClick={() => navigate("/history")}>
                View All Interview History
              </button>
            </div>
          </div>
        ) : (
          /* Active Voice Flow View */
          <div className="voice-interview-card">
            {/* Question Box */}
            <div className="question-display-box">
              <div className="category-tag">{currentQuestion?.category || "Technical Question"}</div>
              <h2 className="question-text">{currentQuestion?.question}</h2>
              <button className="replay-voice-btn" onClick={() => speakText(currentQuestion?.question)}>
                🔊 Replay Question Audio
              </button>
            </div>

            {/* Answer & Mic Controls */}
            {!evaluation ? (
              <div className="answer-section">
                <div className="recording-control-wrapper">
                  <button
                    className={`mic-button ${isListening ? "listening" : ""}`}
                    onClick={toggleListening}
                  >
                    {isListening ? <StopIcon /> : <MicIcon />}
                  </button>

                  <span className="recording-status">
                    {isListening ? "Listening... Speak clearly into your microphone" : "Click microphone to start speaking your answer"}
                  </span>
                </div>

                {errorMessage && <div className="error-alert">{errorMessage}</div>}

                {/* Live Transcript / Manual Input */}
                <div className="transcript-box">
                  <label htmlFor="transcript">Answer Transcript / Text Response:</label>
                  <textarea
                    id="transcript"
                    value={userTranscript}
                    onChange={(e) => setUserTranscript(e.target.value)}
                    placeholder="Your spoken transcript will appear here in real-time. You can also type or edit your answer directly..."
                    rows={4}
                  />
                </div>

                <div className="submit-row">
                  <button
                    className="submit-answer-btn"
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !userTranscript.trim()}
                  >
                    {isSubmitting ? "Evaluating Answer with AI..." : "Submit Answer"}
                  </button>
                </div>
              </div>
            ) : (
              /* Answer Evaluation Box */
              <div className="evaluation-box">
                <div className="evaluation-header">
                  <h3>AI Evaluation & Feedback</h3>
                  <div className={`score-badge ${evaluation.score >= 8 ? "high" : evaluation.score >= 6 ? "mid" : "low"}`}>
                    Score: {evaluation.score}/10
                  </div>
                </div>

                <p className="feedback-text">{evaluation.feedback}</p>

                {evaluation.strengths?.length > 0 && (
                  <div className="strengths-block">
                    <strong>Key Strengths Demonstrated:</strong>
                    <ul>
                      {evaluation.strengths.map((st, i) => (
                        <li key={i}>✓ {st}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.weaknesses?.length > 0 && (
                  <div className="weaknesses-block">
                    <strong>Areas for Improvement / Weaknesses:</strong>
                    <ul>
                      {evaluation.weaknesses.map((wk, i) => (
                        <li key={i}>⚠ {wk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evaluation.suggestedAnswer && (
                  <div className="suggested-block">
                    <strong>Suggested Model Answer:</strong>
                    <p>{evaluation.suggestedAnswer}</p>
                  </div>
                )}

                <div className="next-action-row">
                  <button className="next-btn" onClick={handleNextQuestion}>
                    Proceed to Next Adaptive Question →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default InterviewVoice;
