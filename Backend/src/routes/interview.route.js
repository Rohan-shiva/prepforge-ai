const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @description Generate new interview report on the basis of user self description, resume, and job description
 * @access private
 */
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterviewReportController);

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get interview report by interviewId
 * @access private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController);

/**
 * @route GET /api/interview
 * @description Get all interview reports of logged in user
 * @access private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController);

/**
 * @route POST /api/interview/resume/pdf/:interviewReportId
 * @description Generate resume PDF
 * @access private
 */
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController);

/* =========================================================================
   VOICE MOCK INTERVIEW & SESSION ROUTES
   ========================================================================= */

/**
 * @route POST /api/interview/session/start
 * @description Start a new voice mock interview session
 * @access private
 */
interviewRouter.post("/session/start", authMiddleware.authUser, interviewController.startVoiceSessionController);

/**
 * @route POST /api/interview/session/:sessionId/answer
 * @description Submit spoken answer transcript and get AI evaluation + next adaptive question
 * @access private
 */
interviewRouter.post("/session/:sessionId/answer", authMiddleware.authUser, interviewController.submitVoiceAnswerController);

/**
 * @route POST /api/interview/session/:sessionId/complete
 * @description Finish/complete voice interview session
 * @access private
 */
interviewRouter.post("/session/:sessionId/complete", authMiddleware.authUser, interviewController.completeVoiceSessionController);

/**
 * @route GET /api/interview/sessions
 * @description Get all past voice interview sessions of logged in user (for History)
 * @access private
 */
interviewRouter.get("/sessions", authMiddleware.authUser, interviewController.getVoiceSessionsController);

/**
 * @route GET /api/interview/session/:sessionId
 * @description Get single voice session details by ID
 * @access private
 */
interviewRouter.get("/session/:sessionId", authMiddleware.authUser, interviewController.getVoiceSessionByIdController);

/**
 * @route GET /api/interview/progress
 * @description Get progress analytics & score progression across interviews
 * @access private
 */
interviewRouter.get("/progress", authMiddleware.authUser, interviewController.getProgressAnalyticsController);

module.exports = interviewRouter;