const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf, evaluateVoiceAnswer, generateNextVoiceQuestion } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');
const InterviewSessionModel = require('../models/interviewSession.model');

/**
 * @description Controller to generate interview report based on user self description, resume and job description
 */
async function generateInterviewReportController(req, res) {
  try {
    let resumeText = "";
    if (req.file && req.file.buffer) {
      const parsedPdf = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
      resumeText = parsedPdf.text || "";
    }

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription: selfDescription || "",
      jobDescription: jobDescription || ""
    });

    const interviewReport = await interviewReportModel.create({
      title: interviewReportByAi.title || "Interview Analysis Report",
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      matchScore: interviewReportByAi.matchScore,
      technicalQuestions: interviewReportByAi.technicalQuestions,
      behavioralQuestions: interviewReportByAi.behavioralQuestions,
      skillGaps: interviewReportByAi.skillGaps || interviewReportByAi.skillGap || [],
      preparationPlan: interviewReportByAi.preparationPlan
    });

    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport
    });
  } catch (err) {
    console.error("GENERATE_REPORT_CONTROLLER_ERROR:", err);
    res.status(500).json({ message: "Failed to generate interview report", error: err.message });
  }
}

/**
 * @description Controller to get interview report by interviewId
 */
async function getInterviewReportByIdController(req, res) {
  try {
    const { interviewId } = req.params;
    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id });

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview Report Not Found" });
    }
    res.status(200).json({
      message: "Interview report fetched successfully",
      interviewReport
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching report", error: err.message });
  }
}

/**
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
  try {
    const interviewReports = await interviewReportModel.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Interview reports fetched successfully",
      interviewReports
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching reports", error: err.message });
  }
}

/**
 * @description Controller to generate resume PDF
 */
async function generateResumePdfController(req, res) {
  try {
    const { interviewReportId } = req.params;
    const interviewReport = await interviewReportModel.findById(interviewReportId);

    if (!interviewReport) {
      return res.status(404).json({ message: "Interview report not found" });
    }
    const { resume, jobDescription, selfDescription } = interviewReport;
    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate resume PDF", error: err.message });
  }
}

/**
 * @description Controller to start a new voice mock interview session
 */
async function startVoiceSessionController(req, res) {
  try {
    const { interviewReportId, roleTitle, jobDescription } = req.body;

    let targetRole = roleTitle || "Software Engineer";
    let targetJd = jobDescription || "";
    let initialSkillGaps = [];

    if (interviewReportId) {
      const report = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id });
      if (report) {
        targetRole = report.title || targetRole;
        targetJd = report.jobDescription || targetJd;
        initialSkillGaps = report.skillGaps || [];
      }
    }

    const session = new InterviewSessionModel({
      user: req.user.id,
      interviewReportId: interviewReportId || null,
      roleTitle: targetRole,
      jobDescription: targetJd,
      status: "in_progress",
      questions: []
    });

    // Generate first adaptive question
    const firstQ = await generateNextVoiceQuestion({
      roleTitle: targetRole,
      skillGaps: initialSkillGaps,
      previousQuestions: [],
      lastAnswer: "",
      lastScore: null,
      lastWeaknesses: []
    });

    session.questions.push({
      question: firstQ.question,
      category: firstQ.category || "Technical",
      userAnswer: "",
      score: 0,
      feedback: "",
      strengths: [],
      weaknesses: [],
      suggestedAnswer: ""
    });

    await session.save();

    res.status(201).json({
      message: "Voice interview session started",
      session,
      currentQuestion: session.questions[0]
    });
  } catch (err) {
    console.error("START_VOICE_SESSION_ERROR:", err);
    res.status(500).json({ message: "Failed to start voice interview session", error: err.message });
  }
}

/**
 * @description Controller to submit an answer in a voice mock interview session
 */
async function submitVoiceAnswerController(req, res) {
  try {
    const { sessionId } = req.params;
    const { userAnswer } = req.body;

    const session = await InterviewSessionModel.findOne({ _id: sessionId, user: req.user.id });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.questions.length === 0) {
      return res.status(400).json({ message: "No active question found in session" });
    }

    const currentQ = session.questions[session.questions.length - 1];

    // Evaluate answer with AI
    const evaluation = await evaluateVoiceAnswer({
      question: currentQ.question,
      userAnswer: userAnswer || "No verbal response provided.",
      roleTitle: session.roleTitle,
      category: currentQ.category
    });

    currentQ.userAnswer = userAnswer || "No verbal response provided.";
    currentQ.score = evaluation.score;
    currentQ.feedback = evaluation.feedback;
    currentQ.strengths = evaluation.strengths || [];
    currentQ.weaknesses = evaluation.weaknesses || [];
    currentQ.suggestedAnswer = evaluation.suggestedAnswer || "";

    // Accumulate weaknesses
    if (evaluation.weaknesses && evaluation.weaknesses.length > 0) {
      evaluation.weaknesses.forEach(w => {
        if (!session.observedWeaknesses.includes(w)) {
          session.observedWeaknesses.push(w);
        }
      });
    }

    const totalAnswered = session.questions.length;
    const maxQuestions = 4; // Standard 4-question voice interview

    let sessionCompleted = false;
    let nextQuestion = null;

    if (totalAnswered >= maxQuestions) {
      // Calculate overall score
      const totalScore = session.questions.reduce((acc, q) => acc + q.score, 0);
      session.overallScore = Math.round((totalScore / (totalAnswered * 10)) * 100);
      session.status = "completed";
      sessionCompleted = true;
    } else {
      // Generate adaptive next question based on current score & performance
      const previousQs = session.questions.map(q => q.question);
      const adaptQ = await generateNextVoiceQuestion({
        roleTitle: session.roleTitle,
        skillGaps: session.observedWeaknesses,
        previousQuestions: previousQs,
        lastAnswer: userAnswer,
        lastScore: evaluation.score,
        lastWeaknesses: evaluation.weaknesses
      });

      session.questions.push({
        question: adaptQ.question,
        category: adaptQ.category || "Technical",
        userAnswer: "",
        score: 0,
        feedback: "",
        strengths: [],
        weaknesses: [],
        suggestedAnswer: ""
      });

      nextQuestion = session.questions[session.questions.length - 1];
    }

    session.updatedAt = new Date();
    await session.save();

    res.status(200).json({
      message: "Answer evaluated successfully",
      evaluation,
      sessionCompleted,
      nextQuestion,
      session
    });
  } catch (err) {
    console.error("SUBMIT_VOICE_ANSWER_ERROR:", err);
    res.status(500).json({ message: "Failed to submit answer", error: err.message });
  }
}

/**
 * @description Controller to explicitly complete a voice mock interview session
 */
async function completeVoiceSessionController(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSessionModel.findOne({ _id: sessionId, user: req.user.id });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const answeredQuestions = session.questions.filter(q => q.userAnswer && q.userAnswer.trim().length > 0);
    if (answeredQuestions.length > 0) {
      const totalScore = answeredQuestions.reduce((acc, q) => acc + q.score, 0);
      session.overallScore = Math.round((totalScore / (answeredQuestions.length * 10)) * 100);
    }

    session.status = "completed";
    session.updatedAt = new Date();
    await session.save();

    res.status(200).json({
      message: "Session completed successfully",
      session
    });
  } catch (err) {
    res.status(500).json({ message: "Error completing session", error: err.message });
  }
}

/**
 * @description Controller to get all completed voice interview sessions for history
 */
async function getVoiceSessionsController(req, res) {
  try {
    const sessions = await InterviewSessionModel.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sessions fetched successfully",
      sessions
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching voice sessions", error: err.message });
  }
}

/**
 * @description Controller to get a single voice interview session by ID
 */
async function getVoiceSessionByIdController(req, res) {
  try {
    const { sessionId } = req.params;
    const session = await InterviewSessionModel.findOne({ _id: sessionId, user: req.user.id });

    if (!session) {
      return res.status(404).json({ message: "Voice session not found" });
    }

    res.status(200).json({
      message: "Voice session fetched successfully",
      session
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching voice session", error: err.message });
  }
}

/**
 * @description Controller to calculate user's actual progress analytics across sessions
 */
async function getProgressAnalyticsController(req, res) {
  try {
    const sessions = await InterviewSessionModel.find({ user: req.user.id, status: "completed" })
      .sort({ createdAt: 1 });

    const reports = await interviewReportModel.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    // Overall score progression over time
    const overallProgression = sessions.map((s, idx) => ({
      sessionNum: idx + 1,
      roleTitle: s.roleTitle,
      score: s.overallScore,
      date: s.createdAt
    }));

    // Topic/Skill breakdown calculation from actual questions
    const categoryScoresMap = {};
    sessions.forEach((s) => {
      s.questions.forEach((q) => {
        if (q.userAnswer && q.userAnswer.trim().length > 0) {
          const cat = q.category || "Technical";
          if (!categoryScoresMap[cat]) categoryScoresMap[cat] = [];
          categoryScoresMap[cat].push(Math.round(q.score * 10)); // Scale to 0-100
        }
      });
    });

    const topicProgress = Object.keys(categoryScoresMap).map(cat => ({
      topic: cat,
      scores: categoryScoresMap[cat],
      currentScore: categoryScoresMap[cat].length > 0 ? categoryScoresMap[cat][categoryScoresMap[cat].length - 1] : 0
    }));

    // Initial skill gaps vs observed weaknesses
    const latestReport = reports[0];
    const initialSkillGaps = latestReport ? (latestReport.skillGaps || []) : [];

    const allObservedWeaknesses = [];
    sessions.forEach(s => {
      if (s.observedWeaknesses) {
        s.observedWeaknesses.forEach(w => {
          if (!allObservedWeaknesses.includes(w)) allObservedWeaknesses.push(w);
        });
      }
    });

    res.status(200).json({
      message: "Progress analytics calculated successfully",
      analytics: {
        totalSessions: sessions.length,
        overallProgression,
        topicProgress,
        initialSkillGaps,
        observedWeaknesses: allObservedWeaknesses
      }
    });
  } catch (err) {
    console.error("PROGRESS_ANALYTICS_ERROR:", err);
    res.status(500).json({ message: "Error calculating progress analytics", error: err.message });
  }
}

module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  startVoiceSessionController,
  submitVoiceAnswerController,
  completeVoiceSessionController,
  getVoiceSessionsController,
  getVoiceSessionByIdController,
  getProgressAnalyticsController
};