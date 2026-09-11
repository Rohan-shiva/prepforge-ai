import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router-dom";

const BriefcaseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
    <path d="M3 12h18" />
    <path d="M10 12v1.5h4V12" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c.7-4 3-6 7-6s6.3 2 7 6" />
  </svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 16V4" />
    <path d="m7 9 5-5 5 5" />
    <path d="M5 20h14" />
  </svg>
);

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
    <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h13" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v5h4" />
    <path d="M9 13h6M9 17h4" />
  </svg>
);

const Home = () => {
  const { loading, generateReport, reports, getReports } = useInterview();
  const [jobDescription, setjobDescription] = useState("");
  const [selfDescription, setselfDescription] = useState("");
  const resumeInputRef = useRef();

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "PrepForge AI | Dashboard & Plan Generator";
    getReports();
  }, []);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files?.[0];
    const data = await generateReport({ jobDescription, selfDescription, resumeFile });
    if (data && data._id) {
      navigate(`/interview/${data._id}`);
    }
  };

  if (loading) {
    return (
      <main className="home">
        <div className="home-background">
          <div className="glow glow-one"></div>
          <div className="glow glow-two"></div>
        </div>
        <div className="interview-container" style={{ textAlign: "center", paddingTop: "100px" }}>
          <h1>Generating your AI Interview Plan...</h1>
          <p style={{ color: "#9ca3af", marginTop: "10px" }}>Analyzing resume, self description, and target job requirements...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="home">
      <div className="home-background">
        <div className="glow glow-one"></div>
        <div className="glow glow-two"></div>
      </div>

      <section className="interview-container">
        {/* Header */}
        <header className="page-header">
          <div className="eyebrow">
            <span className="eyebrow-icon">
              <SparkleIcon />
            </span>
            PREPFORGE AI — INTERVIEW PREPARATION
          </div>

          <h1>
            Create your
            <span> Custom Interview Plan</span>
          </h1>

          <p>
            Tell us about the role and yourself. We'll create a personalized
            interview plan designed around your skills, experience, and target
            position.
          </p>
        </header>

        {/* Progress */}
        <div className="progress-wrapper">
          <div className="progress-line"></div>

          <div className="progress-step active">
            <span>01</span>
            <div>
              <strong>Role</strong>
              <small>Job description</small>
            </div>
          </div>

          <div className="progress-step">
            <span>02</span>
            <div>
              <strong>Profile</strong>
              <small>Your background</small>
            </div>
          </div>

          <div className="progress-step">
            <span>03</span>
            <div>
              <strong>Resume</strong>
              <small>Your experience</small>
            </div>
          </div>

          <div className="progress-step">
            <span>04</span>
            <div>
              <strong>Plan</strong>
              <small>AI generated</small>
            </div>
          </div>
        </div>

        {/* Main form */}
        <div className="interview-input-group">
          {/* Job Description */}
          <div className="input-card job-card">
            <div className="card-heading">
              <div className="card-icon">
                <BriefcaseIcon />
              </div>

              <div>
                <span className="card-label">STEP 01</span>
                <h2>Target Role</h2>
                <p>What position are you preparing for?</p>
              </div>
            </div>

            <div className="textarea-wrapper">
              <textarea
                onChange={(e) => { setjobDescription(e.target.value); }}
                name="jobDescription"
                id="jobDescription"
                value={jobDescription}
                placeholder="Paste the job description here..."
              />

              <div className="textarea-footer">
                <span>Include responsibilities, requirements and skills</span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="right-column">
            {/* Self Description */}
            <div className="input-card">
              <div className="card-heading">
                <div className="card-icon profile-icon">
                  <UserIcon />
                </div>

                <div>
                  <span className="card-label">STEP 02</span>
                  <h2>Your Profile</h2>
                  <p>Help us understand your experience.</p>
                </div>
              </div>

              <div className="textarea-wrapper">
                <textarea
                  onChange={(e) => { setselfDescription(e.target.value); }}
                  name="selfDescription"
                  id="selfDescription"
                  value={selfDescription}
                  placeholder="Describe your skills, projects, experience and career goals..."
                />

                <div className="textarea-footer">
                  <span>Tell us what makes you a strong candidate</span>
                  <span>{selfDescription.length} characters</span>
                </div>
              </div>
            </div>

            {/* Resume */}
            <div className="resume-section">
              <div className="resume-heading">
                <div className="resume-title">
                  <span className="card-label">STEP 03</span>
                  <h2>Upload your Resume</h2>
                </div>

                <span className="optional">OPTIONAL</span>
              </div>

              {/* Input guidance */}
              <div className="input-note">
                <div className="note-mark">i</div>
                <div className="note-content">
                  <strong>You can provide either your profile or resume</strong>
                  <p>Both are recommended for a more complete and personalized interview plan.</p>
                </div>
              </div>

              <label htmlFor="resume" className="upload-box">
                <div className="upload-icon">
                  <UploadIcon />
                </div>

                <div className="upload-content">
                  <strong>Drop your resume here</strong>
                  <span>or click to browse from your computer</span>
                </div>

                <div className="upload-format">
                  <FileIcon />
                  PDF
                </div>

                <input
                  ref={resumeInputRef}
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                />
              </label>
            </div>

            {/* Generate */}
            <button className="generate-btn" onClick={handleGenerateReport}>
              <span className="generate-icon">
                <SparkleIcon />
              </span>

              <span className="generate-content">
                <strong>Generate Interview Plan</strong>
                <small>Create my personalized preparation</small>
              </span>

              <span className="generate-arrow">
                <ArrowIcon />
              </span>
            </button>
          </div>
        </div>

        {/* RESTORED SECTION: My Recent Interview Plans */}
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>

          {reports && reports.length > 0 ? (
            <ul className="reports-list">
              {reports.map((report) => (
                <li
                  key={report._id}
                  className="report-item"
                  onClick={() => navigate(`/interview/${report._id}`)}
                >
                  <div className="report-item-header">
                    <h3>{report.title || "Untitled Position"}</h3>
                    <p className="report-meta">
                      Generated {report.createdAt
                        ? new Date(report.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })
                        : "recently"}
                    </p>
                  </div>

                  <div className="report-item-footer">
                    <p
                      className={`match-score ${
                        report.matchScore >= 80
                          ? "score-high"
                          : report.matchScore >= 60
                          ? "score-mid"
                          : "score-low"
                      }`}
                    >
                      Match Score: {report.matchScore ?? 0}%
                    </p>

                    <button className="open-plan-btn">
                      Open Interview Plan →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-plans-box">
              <div className="empty-icon">📁</div>
              <h3>No interview plans yet</h3>
              <p>Generate your first personalized interview plan to see it here.</p>
            </div>
          )}
        </section>

        {/* Bottom trust info */}
        <div className="bottom-info">
          <div>
            <span className="status-dot"></span>
            Your information stays private
          </div>
          <span className="separator">•</span>
          <span>Powered by AI</span>
          <span className="separator">•</span>
          <span>Takes less than a minute</span>
        </div>
      </section>
    </main>
  );
};

export default Home;