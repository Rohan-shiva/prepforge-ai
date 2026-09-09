# PrepForge AI

PrepForge AI is an AI-powered interview preparation platform that analyzes resumes and job descriptions, identifies skill gaps, generates personalized preparation plans, conducts voice-based mock interviews, evaluates performance, and tracks interview progress over time.

## Key Features

- **Profile & Resume Analysis**: Automated comparison of candidate resume, profile, and target job description with job match score.
- **Skill Gap Detection**: Categorizes missing skills into High, Medium, and Low severity gaps.
- **Adaptive Preparation Roadmap**: Personalized day-by-day roadmap addressing specific skill deficiencies.
- **Targeted Practice Q&A**: Tailored technical and behavioral interview questions with answer guidelines and interviewer intent.
- **Voice Mock Interviews**: Interactive AI voice interviews featuring Real-time Speech-to-Text (STT) transcription and Text-to-Speech (TTS) spoken questions.
- **Adaptive Questioning**: AI adjusts question difficulty dynamically based on candidate spoken answer performance.
- **Empirical Progress Tracking**: Tracks score progression over time across mock interview sessions and visualizes skill-by-skill improvement metrics.
- **ATS-Friendly Resume Generator**: Generates professional PDF resumes tailored to the target job description.

## Architecture

- **Frontend**: React 19, Vite, React Router 7, Sass, Axios, Web Speech API.
- **Backend**: Node.js, Express 5, MongoDB / Mongoose, Groq SDK (`openai/gpt-oss-120b`), Puppeteer, PDF Parse.
