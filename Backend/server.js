const app = require('./src/app');
const connectDB = require('./src/config/database');

const invokeGeminiAI = require('./src/services/ai.service');
// const {resume,selfDescription,jobDescription}=require("./src/services/temp");
// const generateInterviewReport=require('./src/services/ai.service');

connectDB();
// generateInterviewReport({resume,selfDescription,jobDescription});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});