import React, { useState, useEffect } from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams } from "react-router-dom";

// Icons
const CodeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m8 9-3 3 3 3" />
    <path d="m16 9 3 3-3 3" />
    <path d="m14 5-4 14" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
  </svg>
);

const RoadmapIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 19V5" />
    <path d="M5 7h10l-2 4 2 4H5" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const TargetIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="12" cy="12" r="1" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 2.5 20h19L12 3Z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const navigationItems = [
  {
    id: "technical",
    label: "Technical",
    description: "Core concepts & skills",
    icon: <CodeIcon />,
  },
  {
    id: "behavioral",
    label: "Behavioral",
    description: "Communication & mindset",
    icon: <UserIcon />,
  },
  {
    id: "roadmap",
    label: "Roadmap",
    description: "Preparation plan",
    icon: <RoadmapIcon />,
  },
];

const Interview = () => {
  const { report, getReportById, loading, getResumePdf, startVoiceSession } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("technical");
  const [openQuestion, setOpenQuestion] = useState(null);

  useEffect(() => {
    document.title = "PrepForge AI | Interview Plan";
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  const handleStartVoice = async () => {
    if (!report) return;
    try {
      const data = await startVoiceSession({
        interviewReportId: report._id,
        roleTitle: report.title,
        jobDescription: report.jobDescription
      });
      if (data && data.session) {
        navigate(`/interview-voice/${data.session._id}`);
      } else {
        navigate("/interview-voice");
      }
    } catch (err) {
      console.error("Failed to start voice interview", err);
      navigate("/interview-voice");
    }
  };

  if (loading || !report) {
    return (
      <main className="loading-container">
        <h2>Loading your Interview Plan...</h2>
      </main>
    );
  }

  const skillGapsList = report.skillGaps || report.skillGap || [];

  const renderQuestions = (questions, type) => {
    return (
      <div className="questions-list">
        {questions.map((item, index) => (
          <article
            className={`question-card ${openQuestion === `${type}-${index}` ? "open" : ""}`}
            key={index}
          >
            <button
              className="question-header"
              onClick={() =>
                setOpenQuestion(openQuestion === `${type}-${index}` ? null : `${type}-${index}`)
              }
            >
              <span className="question-number">{String(index + 1).padStart(2, "0")}</span>
              <div className="question-title">
                <h3>{item.question}</h3>
                <span>Interview question</span>
              </div>
              <span className="question-arrow">
                <ArrowIcon />
              </span>
            </button>

            {openQuestion === `${type}-${index}` && (
              <div className="question-details">
                <div className="detail-block intention-block">
                  <span className="detail-label">What the interviewer wants to assess</span>
                  <p>{item.intention}</p>
                </div>

                <div className="detail-block answer-block">
                  <span className="detail-label">Suggested answer</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (activeSection === "technical") {
      return (
        <>
          <div className="content-header">
            <div>
              <span className="content-eyebrow">INTERVIEW PRACTICE</span>
              <h1>Technical Questions</h1>
              <p>Practice questions based on your projects, technical background, and target role.</p>
            </div>
            <div className="content-count">
              {report.technicalQuestions?.length || 0}
              <span>questions</span>
            </div>
          </div>
          {renderQuestions(report.technicalQuestions || [], "technical")}
        </>
      );
    }

    if (activeSection === "behavioral") {
      return (
        <>
          <div className="content-header">
            <div>
              <span className="content-eyebrow">INTERVIEW PRACTICE</span>
              <h1>Behavioral Questions</h1>
              <p>Practice communication, problem-solving, teamwork, and decision-making questions.</p>
            </div>
            <div className="content-count">
              {report.behavioralQuestions?.length || 0}
              <span>questions</span>
            </div>
          </div>
          {renderQuestions(report.behavioralQuestions || [], "behavioral")}
        </>
      );
    }

    if (activeSection === "roadmap") {
      return (
        <>
          <div className="content-header">
            <div>
              <span className="content-eyebrow">PREPARATION PLAN</span>
              <h1>Your Roadmap</h1>
              <p>A focused plan to improve your preparation before the interview.</p>
            </div>
            <div className="content-count">
              {report.preparationPlan?.length || 0}
              <span>days</span>
            </div>
          </div>

          <div className="roadmap-list">
            {(report.preparationPlan || []).map((item) => (
              <article className="roadmap-card" key={item.day}>
                <div className="day-indicator">
                  <span>DAY</span>
                  <strong>{item.day}</strong>
                </div>
                <div className="roadmap-content">
                  <h3>{item.focus}</h3>
                  <p>{item.tasks}</p>
                </div>
              </article>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <main className="interview-page">
      {/* Left sidebar */}
      <aside className="interview-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="brand-mark">PF</div>
            <div>
              <strong>{report.title || "Interview Plan"}</strong>
              <span>Preparation plan</span>
            </div>
          </div>
        </div>

        <nav className="interview-navigation">
          <span className="navigation-label">PREPARATION</span>

          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`navigation-item ${activeSection === item.id ? "active" : ""}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="navigation-icon">{item.icon}</span>
              <span className="navigation-text">
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </button>
          ))}

          <button className="voice-interview-btn" onClick={handleStartVoice}>
            <MicIcon />
            Start Voice Mock Interview
          </button>

          <button className="button-primary-button" onClick={() => getResumePdf(interviewId)}>
            <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path>
            </svg>
            Download ATS Resume
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="score-mini">
            <div className="score-ring">
              <span>{report.matchScore ?? 0}%</span>
            </div>
            <div>
              <strong>Profile Match</strong>
              <small>Based on target role</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="interview-content">
        <div className="content-scroll">{renderContent()}</div>
      </section>

      {/* Right sidebar */}
      <aside className="skill-gap-sidebar">
        <div className="skill-gap-header">
          <div className="skill-gap-title">
            <div className="skill-gap-icon">
              <TargetIcon />
            </div>
            <div>
              <span>PROFILE ANALYSIS</span>
              <h2>Skill Gaps</h2>
            </div>
          </div>
        </div>

        {/* Match score */}
        <div className="match-score-card">
          <div className="score-circle">
            <div>
              <strong>{report.matchScore ?? 0}</strong>
              <span>%</span>
            </div>
          </div>
          <div className="score-information">
            <strong>Current Match Score</strong>
            <p>Your current profile alignment for this target role.</p>
          </div>
        </div>

        {/* Skill gaps list */}
        <div className="gaps-section">
          <div className="gaps-heading">
            <h3>Areas to improve</h3>
            <span>{skillGapsList.length}</span>
          </div>

          {skillGapsList.length > 0 ? (
            <div className="gaps-list">
              {skillGapsList.map((skill, index) => {
                const skillName = typeof skill === "object" ? skill.skill : skill;
                const severity = typeof skill === "object" ? skill.severity : "Medium";
                return (
                  <div className="skill-gap-item" key={index}>
                    <div className="gap-warning">
                      <WarningIcon />
                    </div>
                    <div>
                      <strong>{skillName}</strong>
                      <span className={`severity-badge ${severity ? severity.toLowerCase() : ""}`}>
                        {severity} Severity Gap
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-gaps">
              <div className="empty-icon">
                <CheckIcon />
              </div>
              <h4>No major gaps found</h4>
              <p>No critical skill gaps identified from analysis.</p>
            </div>
          )}
        </div>
      </aside>
    </main>
  );
};

export default Interview;