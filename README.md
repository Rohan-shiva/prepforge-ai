# PrepForge AI — Full-Stack AI-Powered Interview Preparation & Voice Mock Platform

[![Project Status: Active](https://img.shields.io/badge/Project--Status-Active-brightgreen.svg)](#)
[![Stack: MERN + Groq AI](https://img.shields.io/badge/Stack-React%2019%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB%20%7C%20Groq%20AI-6366f1)](#)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](#)

**PrepForge AI** is a full-stack, end-to-end interview preparation platform that transforms resume parsing and job description analysis into an interactive, voice-driven mock interview experience. 

By combining natural language processing, real-time Speech-to-Text (STT), Text-to-Speech (TTS) audio playback, adaptive AI question generation, and empirical performance analytics, **PrepForge AI** bridges the gap between static studying and real-world interview execution.

---

## 📋 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Installation & Setup Guide](#-installation--setup-guide)
- [Environment Variables](#-environment-variables)
- [Voice Mock Interview Flow](#-voice-mock-interview-flow)
- [Progress Analytics & Evaluation](#-progress-analytics--evaluation)
- [License](#-license)

---

## 🌐 Overview & Architecture

PrepForge AI operates on a modern 4-tier layer architecture:

```
                          +-----------------------------------+
                          |     Public Landing Page & UI      |
                          |  (React 19, Vite, SCSS, Router 7) |
                          +-----------------------------------+
                                            |
                                            v
                          +-----------------------------------+
                          |  Hooks, Context & Web Speech API  |
                          |  (STT SpeechRec / TTS Synthesis)  |
                          +-----------------------------------+
                                            |
                                            v
                          +-----------------------------------+
                          |  REST API & Middleware Security   |
                          | (Node.js, Express, JWT Cookies)   |
                          +-----------------------------------+
                                            |
                                            v
                          +-----------------------------------+
                          |    AI Engine & Database Layer     |
                          | (Groq GPT-OSS-120B, MongoDB, PDF) |
                          +-----------------------------------+
```

---

## ✨ Key Features

### 🏠 1. Public Landing Page & Product Showcase
- **Unauthenticated Entry Point**: Introduces visitors to the product workflow, feature capabilities, interactive voice showcase, and progress metrics before requiring authentication.
- **Dynamic Header Navigation**: Sticky navigation bar offering context-aware actions (`Login`, `Get Started` for visitors; `Dashboard`, `Voice Mock`, `History`, `Progress`, `Logout` for authenticated users).

### 🔐 2. Authentication & User Security
- **JWT HTTP-Only Cookies**: Secure session persistence with strict `sameSite: "lax"` cookie flags preventing client-side script tampering.
- **Token Blacklisting**: Server-side token invalidation model upon logout preventing replay attacks.
- **User Ownership Isolation**: All stored interview plans, voice sessions, and progress analytics are strictly isolated and authorized by user ID.

### 📄 3. Resume Parsing & Profile Alignment
- **PDF Resume Upload**: Memory-buffer binary parsing extracting raw resume text using `pdf-parse`.
- **Match Score Engine**: Evaluates alignment (0–100%) between the candidate's resume, self-description, and target job description.

### 🎯 4. Skill Gap Detection & Dynamic Roadmap
- **Categorized Skill Gaps**: Identifies high, medium, and low severity deficiencies required by the target job role.
- **Personalized Preparation Plan**: Generates dynamic day-by-day learning roadmaps customized specifically to missing competencies.

### 💻 5. Technical & Behavioral Q&A Generation
- **Role-Specific Q&A**: Generates technical and STAR-method behavioral interview questions.
- **Interviewer Intention & Answer Guides**: Breaks down what the interviewer assesses alongside model answer guidelines.

### 🎙️ 6. Interactive Voice Mock Interview Engine
- **Text-to-Speech (TTS)**: AI interviewer reads questions aloud using Web Speech Synthesis.
- **Real-Time Speech-to-Text (STT)**: Transcribes candidate spoken answers in real-time using `SpeechRecognition` / `webkitSpeechRecognition`.
- **Manual Text Fallback**: Seamless fallback input for browsers without speech recognition support.
- **Adaptive Questioning**: AI adjusts question difficulty dynamically:
  - *Low Score (<6/10)* → Asks simpler/foundational follow-up questions to assess basic knowledge.
  - *High Score (>=8/10)* → Increases difficulty with complex scenario-based and architectural questions.

### 📊 7. Instant Evaluation & Feedback
- **0–10 Question Scoring**: Scores each answer objectively.
- **Strengths & Weaknesses**: Extracts key candidate strengths and observed weaknesses.
- **Model Answer Generation**: Provides ideal responses for comparison.

### 📜 8. Interview History & Question Transcripts
- **Complete Session Storage**: Persists all voice interviews in MongoDB.
- **Question-Level Breakdown**: Detailed review of spoken answer transcripts, scores, AI feedback, and TTS audio replay.

### 📈 9. Empirical Progress Analytics
- **Overall Score Progression**: Visual bar chart tracking overall interview performance over time (e.g. Session 1: 58 → Session 2: 67 → Session 3: 74).
- **Topic Performance Curves**: Tracks improvement across specific domains (SQL, Python, React, System Design, Communication).
- **Gap vs. Weakness Comparison**: Compares initial initial skill gaps (from resume) against observed interview weaknesses (from spoken performance).

### 📄 10. ATS-Friendly Resume Generator
- **HTML/CSS Resume Compilation**: AI tailors resume content specifically to target job keywords without fabrication.
- **Puppeteer PDF Export**: Renders single-column, standard-compliant ATS PDFs ready for job applications.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Routing**: React Router 7 (`createBrowserRouter`)
- **Styling**: SCSS (Sass 1.102), LightningCSS
- **HTTP Client**: Axios (with credentials)
- **Speech Integration**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express 5
- **Database**: MongoDB & Mongoose 9
- **AI SDK**: Groq SDK (`openai/gpt-oss-120b`)
- **PDF Processing**: `pdf-parse` & `puppeteer`
- **Security**: `jsonwebtoken`, `bcryptjs`, `cookie-parser`, `cors`

---

## 📁 Project Directory Structure

```text
PrepForge_AI/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js             # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # User registration, login, logout, getMe
│   │   │   └── interview.controller.js # Report generation, voice sessions, analytics
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # JWT cookie verification middleware
│   │   │   └── file.middleware.js      # Multer memory storage file upload
│   │   ├── models/
│   │   │   ├── user.model.js           # User schema
│   │   │   ├── blacklist.model.js      # Revoked token schema
│   │   │   ├── interviewReport.model.js# Analysis report schema
│   │   │   └── interviewSession.model.js# Voice mock session schema
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # Authentication routes
│   │   │   └── interview.route.js      # Interview & Voice API routes
│   │   ├── services/
│   │   │   └── ai.service.js           # Groq AI prompts, structured JSON & Puppeteer PDF
│   │   └── app.js                      # Express application initialization
│   ├── .env                            # Backend environment secrets
│   ├── server.js                       # Server entry point (Port 3000)
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── assets/                     # SVG icons & logo graphics
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/Protected.jsx
│   │   │   │   ├── hooks/useAuth.js
│   │   │   │   ├── pages/Login.jsx
│   │   │   │   ├── pages/Register.jsx
│   │   │   │   └── auth.context.jsx
│   │   │   ├── interview/
│   │   │   │   ├── components/Navbar.jsx
│   │   │   │   ├── hooks/useInterview.js
│   │   │   │   ├── pages/Home.jsx           # Authenticated Plan Generator & Recent Plans
│   │   │   │   ├── pages/Interview.jsx      # Interview Plan Detail View
│   │   │   │   ├── pages/InterviewVoice.jsx # Interactive Voice Mock Session
│   │   │   │   ├── pages/History.jsx        # Session History & Transcripts
│   │   │   │   ├── pages/Progress.jsx       # Progress Analytics Dashboard
│   │   │   │   ├── pages/LandingPage.jsx    # Public Product Landing Page
│   │   │   │   ├── services/interview.api.js
│   │   │   │   └── interview.context.jsx
│   │   │   └── services/
│   │   │       └── auth.api.js
│   │   ├── App.jsx
│   │   ├── app.routes.jsx              # React Router configuration
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                          # Git ignore rules
└── README.md                           # Documentation
```

---

## 📡 API Endpoints Reference

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Registers a new user account & sets HTTP-only JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticates user & sets HTTP-only JWT cookie |
| `POST` / `GET` | `/api/auth/logout` | Public | Clears cookie & adds token to server blacklist |
| `GET` | `/api/auth/get-me` | Private | Fetches current logged-in user profile |

### Interview & Voice Routes (`/api/interview`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview` | Private | Analyzes resume PDF, self description & JD to create report |
| `GET` | `/api/interview` | Private | Fetches all recent interview plans of logged-in user |
| `GET` | `/api/interview/report/:interviewId` | Private | Fetches detailed interview analysis report by ID |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | Private | Generates tailored ATS resume PDF via Puppeteer |
| `POST` | `/api/interview/session/start` | Private | Starts a new voice mock interview session |
| `POST` | `/api/interview/session/:sessionId/answer` | Private | Submits spoken transcript, evaluates answer & gets next adaptive Q |
| `POST` | `/api/interview/session/:sessionId/complete` | Private | Finalizes voice mock interview session |
| `GET` | `/api/interview/sessions` | Private | Fetches all past completed voice interview sessions |
| `GET` | `/api/interview/session/:sessionId` | Private | Fetches single voice session details & transcript |
| `GET` | `/api/interview/progress` | Private | Computes overall score progression & topic analytics |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `Backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

## 🚀 Installation & Setup Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Database (Local or MongoDB Atlas)
- Groq API Key

### 1. Clone Repository
```bash
git clone https://github.com/Rohan-shiva/prepforge-ai.git
cd prepforge-ai
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Start the backend server:
```bash
npm run dev
# Server running at http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd Frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
# Application running at http://localhost:5173
```

---

## 🎙️ Voice Mock Interview Flow

```text
       Candidate Clicks "Start Voice Session"
                         │
                         ▼
        AI Interviewer Speaks Question (TTS)
                         │
                         ▼
       Candidate Listens & Speaks Answer (STT)
                         │
                         ▼
       Transcript Displayed & Answer Submitted
                         │
                         ▼
          AI Evaluates Response (0-10)
  (Feedback, Strengths, Weaknesses, Model Answer)
                         │
                         ▼
        Score Check & Dynamic Question Adaptation
       ┌─────────────────┴─────────────────┐
       ▼                                   ▼
Score < 6/10                         Score >= 8/10
(Simpler / Follow-up Q)              (In-depth / Advanced Q)
       └─────────────────┬─────────────────┘
                         │
                         ▼
            Complete 4-Question Session
                         │
                         ▼
       Overall Session Score & Weaknesses Saved
```

---

## 📄 License

Distributed under the **ISC License**. See `LICENSE` for more information.

---

**PrepForge AI** — Prepare Smarter. Interview Better.
