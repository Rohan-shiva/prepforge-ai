const mongoose = require('mongoose');

const questionEvaluationSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'General'],
    default: 'Technical'
  },
  userAnswer: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  feedback: {
    type: String,
    default: ''
  },
  strengths: [{
    type: String
  }],
  weaknesses: [{
    type: String
  }],
  suggestedAnswer: {
    type: String
  },
  askedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  interviewReportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InterviewReport'
  },
  roleTitle: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  questions: [questionEvaluationSchema],
  observedWeaknesses: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const InterviewSessionModel = mongoose.model('InterviewSession', interviewSessionSchema);

module.exports = InterviewSessionModel;
