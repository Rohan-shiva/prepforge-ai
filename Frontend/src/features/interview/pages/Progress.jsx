import React, { useEffect } from "react";
import { useInterview } from "../hooks/useInterview";
import "./Progress.scss";

const Progress = () => {
  const { fetchProgressAnalytics, analytics, loading } = useInterview();

  useEffect(() => {
    document.title = "PrepForge AI | Progress Tracking";
    fetchProgressAnalytics();
  }, []);

  if (loading && !analytics) {
    return (
      <main className="progress-page">
        <div className="progress-container">
          <h2>Calculating your Progress Analytics...</h2>
        </div>
      </main>
    );
  }

  const overall = analytics?.overallProgression || [];
  const topics = analytics?.topicProgress || [];
  const initialGaps = analytics?.initialSkillGaps || [];
  const observedWeaknesses = analytics?.observedWeaknesses || [];

  return (
    <main className="progress-page">
      <div className="progress-container">
        <header className="progress-header">
          <div>
            <h1>Progress & Skill Improvement Tracking</h1>
            <p>Empirical score progression across mock interviews and topic-by-topic performance tracking.</p>
          </div>
        </header>

        {(!analytics || analytics.totalSessions === 0) ? (
          <div className="empty-analytics-card">
            <div className="empty-icon">📈</div>
            <h3>No Progress Data Recorded Yet</h3>
            <p>Complete mock voice interview sessions to unlock real-time score progression graphs and skill-by-skill improvement metrics.</p>
          </div>
        ) : (
          <div className="analytics-grid">
            {/* Overall Score Progression Card */}
            <section className="analytics-card full-width">
              <div className="card-title">
                <h2>Overall Interview Score Progression</h2>
                <span>{overall.length} Completed Session(s)</span>
              </div>

              <div className="progression-bar-chart">
                {overall.map((item, idx) => (
                  <div key={idx} className="chart-bar-group">
                    <div className="bar-wrapper">
                      <div
                        className="bar-fill"
                        style={{ height: `${Math.max(item.score, 10)}%` }}
                      >
                        <span className="bar-val">{item.score}</span>
                      </div>
                    </div>
                    <span className="bar-label">Session #{item.sessionNum}</span>
                    <small className="bar-role">{item.roleTitle}</small>
                  </div>
                ))}
              </div>
            </section>

            {/* Skill / Topic Progression Cards */}
            <section className="analytics-card">
              <div className="card-title">
                <h2>Topic Performance & Progression</h2>
                <span>Calculated from spoken interview answers</span>
              </div>

              <div className="topics-list">
                {topics.length > 0 ? (
                  topics.map((t, idx) => (
                    <div key={idx} className="topic-item">
                      <div className="topic-header">
                        <strong className="topic-name">{t.topic}</strong>
                        <span className="topic-progression-str">
                          {t.scores.join(" → ")}
                        </span>
                      </div>

                      <div className="topic-progress-bar-bg">
                        <div
                          className="topic-progress-bar-fill"
                          style={{ width: `${Math.min(t.currentScore, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data-text">No topic scores calculated yet.</p>
                )}
              </div>
            </section>

            {/* Initial Skill Gaps vs Observed Weaknesses Card */}
            <section className="analytics-card">
              <div className="card-title">
                <h2>Skill Gaps vs. Observed Weaknesses</h2>
                <span>Conceptual Comparison</span>
              </div>

              <div className="comparison-columns">
                <div className="comp-col">
                  <h3>Initial Skill Gaps</h3>
                  <small>Based on Resume + Self Description + Job Description</small>
                  <ul className="gaps-tags">
                    {initialGaps.length > 0 ? (
                      initialGaps.map((g, idx) => {
                        const sName = typeof g === "object" ? g.skill : g;
                        const sSev = typeof g === "object" ? g.severity : "Medium";
                        return (
                          <li key={idx} className={`gap-tag ${sSev ? sSev.toLowerCase() : ""}`}>
                            {sName} ({sSev || "Medium"})
                          </li>
                        );
                      })
                    ) : (
                      <p className="no-data-text">No initial skill gaps identified.</p>
                    )}
                  </ul>
                </div>

                <div className="comp-col">
                  <h3>Observed Interview Weaknesses</h3>
                  <small>Based on actual voice mock interview performance</small>
                  <ul className="weakness-tags">
                    {observedWeaknesses.length > 0 ? (
                      observedWeaknesses.map((w, idx) => (
                        <li key={idx} className="weakness-tag">
                          ⚠ {w}
                        </li>
                      ))
                    ) : (
                      <p className="no-data-text">No weaknesses observed during mock interviews yet.</p>
                    )}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
};

export default Progress;
