require("dotenv").config();
const express=require('express');
const cookieParser=require('cookie-parser');
const authRouter=require('./routes/auth.routes');
const interviewRouter=require('../src/routes/interview.route');
const cors=require('cors');

const app=express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      (process.env.CLIENT_URL && origin === process.env.CLIENT_URL)
    ) {
      return callback(null, origin);
    }
    return callback(null, origin);
  },
  credentials: true
}));


app.use('/api/auth',authRouter);
app.use('/api/interview',interviewRouter);

module.exports=app;