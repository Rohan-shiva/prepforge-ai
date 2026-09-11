import {
  getAllInterviewReports,
  generateInterviewReport,
  getInterviewReportById,
  generateResumePdf,
  startVoiceSession as apiStartVoiceSession,
  submitVoiceAnswer as apiSubmitVoiceAnswer,
  completeVoiceSession as apiCompleteVoiceSession,
  getVoiceSessions as apiGetVoiceSessions,
  getVoiceSessionById as apiGetVoiceSessionById,
  getProgressAnalytics as apiGetProgressAnalytics
} from "../services/interview.api";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import { useParams } from "react-router";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    activeSession,
    setActiveSession,
    sessions,
    setSessions,
    analytics,
    setAnalytics
  } = context;

  const { interviewId } = useParams();

  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (id) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(id);
      setReport(response.interviewReport);
      return response.interviewReport;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      setReports(response.interviewReports);
      return response.interviewReports;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getResumePdf = async (interviewReportId) => {
    setLoading(true);
    try {
      const response = await generateResumePdf({ interviewReportId });
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_${interviewReportId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* Voice session methods */
  const startVoiceSession = async ({ interviewReportId, roleTitle, jobDescription }) => {
    setLoading(true);
    try {
      const data = await apiStartVoiceSession({ interviewReportId, roleTitle, jobDescription });
      setActiveSession(data.session);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitVoiceAnswer = async ({ sessionId, userAnswer }) => {
    setLoading(true);
    try {
      const data = await apiSubmitVoiceAnswer({ sessionId, userAnswer });
      setActiveSession(data.session);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeVoiceSession = async ({ sessionId }) => {
    setLoading(true);
    try {
      const data = await apiCompleteVoiceSession({ sessionId });
      setActiveSession(data.session);
      return data;
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchVoiceSessions = async () => {
    setLoading(true);
    try {
      const data = await apiGetVoiceSessions();
      setSessions(data.sessions);
      return data.sessions;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVoiceSessionById = async ({ sessionId }) => {
    setLoading(true);
    try {
      const data = await apiGetVoiceSessionById({ sessionId });
      setActiveSession(data.session);
      return data.session;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgressAnalytics = async () => {
    setLoading(true);
    try {
      const data = await apiGetProgressAnalytics();
      setAnalytics(data.analytics);
      return data.analytics;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  return {
    loading,
    report,
    reports,
    activeSession,
    sessions,
    analytics,
    generateReport,
    getReportById,
    getReports,
    getResumePdf,
    startVoiceSession,
    submitVoiceAnswer,
    completeVoiceSession,
    fetchVoiceSessions,
    fetchVoiceSessionById,
    fetchProgressAnalytics
  };
};