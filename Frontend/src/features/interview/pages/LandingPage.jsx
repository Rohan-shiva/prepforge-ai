import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import './LandingPage.scss';

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3Z" />
    <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z" />
  </svg>
);

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.title = "PrepForge AI | AI-Powered Interview Preparation";
  }, []);

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const workflowSteps = [
    { num: '01', title: 'Upload Resume', desc: 'Provide your existing PDF resume' },
    { num: '02', title: 'Add Self Description', desc: 'Highlight your career background & goals' },
    { num: '03', title: 'Add Job Description', desc: 'Paste the target job role details' },
    { num: '04', title: 'AI Profile Analysis', desc: 'AI calculates job match & alignment' },
    { num: '05', title: 'Discover Skill Gaps', desc: 'Identify high, medium & low severity gaps' },
    { num: '06', title: 'Practice Q&A', desc: 'Targeted technical & behavioral questions' },
    { num: '07', title: 'Voice Mock Interviews', desc: 'Interactive AI voice interviews with STT' },
    { num: '08', title: 'Track Progress', desc: 'Monitor score progression across interviews' }
  ];

  const featureCards = [
    { icon: '🎯', title: 'Job Match Score', desc: 'Quantifiable alignment score between your profile and target job description.' },
    { icon: '🔍', title: 'Skill Gap Detection', desc: 'Automated extraction of critical technical and soft skill gaps with severity levels.' },
    { icon: '🗺️', title: 'Adaptive Roadmap', desc: 'Dynamic day-by-day preparation roadmap tailored to your specific missing skills.' },
    { icon: '💻', title: 'Technical Questions', desc: 'Targeted coding and system design Q&A tailored to job responsibilities.' },
    { icon: '🗣️', title: 'Behavioral Questions', desc: 'STAR-method practice scenarios assessing teamwork and decision making.' },
    { icon: '🎙️', title: 'AI Voice Mock Interview', desc: 'Spoken AI interviewer reading questions and listening to your voice answers.' },
    { icon: '📊', title: 'Instant Evaluation', desc: 'Detailed 0-10 question scoring, strengths, weaknesses, and model answers.' },
    { icon: '📈', title: 'Skill Progress Tracking', desc: 'Empirical skill improvement graphs across multiple mock interview sessions.' },
    { icon: '📄', title: 'ATS Resume Generator', desc: 'Generates structured, professional ATS-friendly resumes in Puppeteer PDF format.' }
  ];

  return (
    <div className="landing-page">
      <div className="landing-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      <div className="landing-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-eyebrow">
            <span className="sparkle"><SparkleIcon /></span>
            PREPFORGE AI — INTERVIEW PREPARATION PLATFORM
          </div>

          <h1 className="hero-headline">
            Prepare Smarter. <br />
            <span className="gradient-text">Interview Better.</span>
          </h1>

          <p className="hero-subtext">
            Turn your resume and target job description into a personalized AI-powered interview preparation experience with custom Q&A, adaptive roadmaps, and voice mock interviews.
          </p>

          <div className="hero-cta-group">
            <button className="cta-primary-btn" onClick={handleStart}>
              {user ? 'Go to Dashboard →' : 'Get Started Free'}
            </button>
            <a href="#how-it-works" className="cta-secondary-btn">
              See How It Works
            </a>
          </div>

          <div className="hero-stats-bar">
            <div className="stat-item">
              <strong>100%</strong>
              <span>Personalized AI Analysis</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat-item">
              <strong>Voice & Text</strong>
              <span>Mock Interview Modes</span>
            </div>
            <div className="stat-divider">•</div>
            <div className="stat-item">
              <strong>ATS Friendly</strong>
              <span>PDF Resume Improvement</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="section-block">
          <div className="section-header">
            <span className="section-subtitle">STEP-BY-STEP WORKFLOW</span>
            <h2>How It Works</h2>
            <p>From resume upload to interactive voice mock interviews in eight simple steps.</p>
          </div>

          <div className="workflow-grid">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="workflow-card">
                <span className="step-number">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="section-block">
          <div className="section-header">
            <span className="section-subtitle">COMPREHENSIVE TOOLKIT</span>
            <h2>All Features You Need to Succeed</h2>
            <p>Built specifically for software engineers, data analysts, and tech candidates.</p>
          </div>

          <div className="features-grid">
            {featureCards.map((feat, idx) => (
              <div key={idx} className="feature-card">
                <div className="feat-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VOICE MOCK INTERVIEW SECTION */}
        <section id="voice-mock" className="section-block voice-showcase-section">
          <div className="voice-showcase-card">
            <div className="voice-badge">FLAGSHIP FEATURE</div>
            <h2>Practice Interviews Like a Real Interview</h2>
            <p>
              Experience our complete interactive voice flow. The AI interviewer speaks questions aloud, listens to your spoken answer, transcribes it in real-time, evaluates your performance, and adaptively selects the next question based on your score.
            </p>

            <div className="voice-steps-row">
              <div className="v-step">
                <div className="v-num">1</div>
                <strong>AI Speaks Question</strong>
                <span>Text displayed & spoken out loud</span>
              </div>
              <div className="v-arrow">→</div>
              <div className="v-step">
                <div className="v-num">2</div>
                <strong>Candidate Speaks</strong>
                <span>Real-time Speech-to-Text transcript</span>
              </div>
              <div className="v-arrow">→</div>
              <div className="v-step">
                <div className="v-num">3</div>
                <strong>AI Evaluator</strong>
                <span>0-10 scoring & feedback</span>
              </div>
              <div className="v-arrow">→</div>
              <div className="v-step">
                <div className="v-num">4</div>
                <strong>Adaptive Next Q</strong>
                <span>Difficulty adjusts automatically</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROGRESS SECTION */}
        <section id="progress-demo" className="section-block">
          <div className="section-header">
            <span className="section-subtitle">EMPIRICAL PROGRESS TRACKING</span>
            <h2>Track Performance Over Time</h2>
            <p>Monitor your interview readiness score and topic progression after every mock interview session.</p>
          </div>

          <div className="progress-demo-grid">
            <div className="demo-card">
              <h3>Overall Score Progression</h3>
              <div className="demo-progression-list">
                <div className="prog-step-item">
                  <span>Interview #1</span>
                  <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width: '58%' }}></div></div>
                  <strong>58/100</strong>
                </div>
                <div className="prog-step-item">
                  <span>Interview #2</span>
                  <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width: '67%' }}></div></div>
                  <strong>67/100</strong>
                </div>
                <div className="prog-step-item">
                  <span>Interview #3</span>
                  <div className="prog-bar-bg"><div className="prog-bar-fill" style={{ width: '74%' }}></div></div>
                  <strong>74/100</strong>
                </div>
              </div>
            </div>

            <div className="demo-card">
              <h3>Topic & Skill Improvement</h3>
              <div className="demo-skills-list">
                <div className="skill-prog-row">
                  <strong>SQL:</strong>
                  <span className="prog-chain">42 → 55 → 64 → 76</span>
                </div>
                <div className="skill-prog-row">
                  <strong>Python:</strong>
                  <span className="prog-chain">71 → 78 → 82 → 88</span>
                </div>
                <div className="skill-prog-row">
                  <strong>Statistics:</strong>
                  <span className="prog-chain">48 → 57 → 63 → 69</span>
                </div>
              </div>
              <small className="demo-note">* Illustrative example. Actual user scores are calculated dynamically from database evaluations.</small>
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="final-cta-section">
          <h2>Ready to prepare for your next interview?</h2>
          <p>Create your custom interview plan and start practicing voice mock interviews today.</p>
          <button className="cta-primary-btn" onClick={handleStart}>
            {user ? 'Start Preparing Now →' : 'Create Free Account →'}
          </button>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
