import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});

/**
 * @description Service to generate report based on user self description, resume and job description
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription || "");
  formData.append("selfDescription", selfDescription || "");
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const response = await api.post("/api/interview", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

/**
 * @description Service to get interview report by interviewId
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/report/${interviewId}`);
  return response.data;
};

/**
 * @description Service to get all interview reports of logged in user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};

/**
 * @description Service to generate Resume Pdf based on user Job Description, Self Description and Resume
 */
export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: "blob"
  });
  return response.data;
};

/* =========================================================================
   VOICE MOCK INTERVIEW & SESSION SERVICES
   ========================================================================= */

export const startVoiceSession = async ({ interviewReportId, roleTitle, jobDescription }) => {
  const response = await api.post("/api/interview/session/start", {
    interviewReportId,
    roleTitle,
    jobDescription
  });
  return response.data;
};

export const submitVoiceAnswer = async ({ sessionId, userAnswer }) => {
  const response = await api.post(`/api/interview/session/${sessionId}/answer`, {
    userAnswer
  });
  return response.data;
};

export const completeVoiceSession = async ({ sessionId }) => {
  const response = await api.post(`/api/interview/session/${sessionId}/complete`);
  return response.data;
};

export const getVoiceSessions = async () => {
  const response = await api.get("/api/interview/sessions");
  return response.data;
};

export const getVoiceSessionById = async ({ sessionId }) => {
  const response = await api.get(`/api/interview/session/${sessionId}`);
  return response.data;
};

export const getProgressAnalytics = async () => {
  const response = await api.get("/api/interview/progress");
  return response.data;
};