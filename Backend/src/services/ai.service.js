const Groq = require('groq-sdk');
const { z } = require("zod");
const puppeteer = require('puppeteer');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : ""
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `
  Analyze the candidate against the job description.

    Generate:
    1. A match score from 0 to 100.
    2. Relevant technical interview questions.
    3. Relevant behavioral interview questions.
    4. Candidate skill gaps with severity.
    5. A personalized preparation plan based on the candidate's skills, skill gaps, match score, existing strengths, and target job requirements.
    6. A short job title based on the provided job description.

    The preparation plan must be personalized and dynamic. Do NOT use a fixed number of preparation days.
  `;

    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: `You MUST analyze the candidate information provided in the user message.
Generate the interview report using ONLY the information provided.
Return a complete JSON object matching the provided JSON schema.

ALL required fields must be present:
- matchScore
- technicalQuestions
- behavioralQuestions
- skillGaps
- preparationPlan
- title`
                },
                {
                    role: "user",
                    content: `
            CANDIDATE RESUME:
            -----------------
            ${resume}

            CANDIDATE SELF DESCRIPTION:
            ---------------------------
            ${selfDescription}

            TARGET JOB DESCRIPTION:
            -----------------------
            ${jobDescription}

            Now analyze the candidate and generate the complete interview report.
            `
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "interview_report",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            matchScore: {
                                type: "number",
                                description: "Score between 0 and 100 indicating how well the candidate matches the job"
                            },
                            technicalQuestions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        question: { type: "string" },
                                        intention: { type: "string" },
                                        answer: { type: "string" }
                                    },
                                    required: ["question", "intention", "answer"],
                                    additionalProperties: false
                                }
                            },
                            behavioralQuestions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        question: { type: "string" },
                                        intention: { type: "string" },
                                        answer: { type: "string" }
                                    },
                                    required: ["question", "intention", "answer"],
                                    additionalProperties: false
                                }
                            },
                            skillGaps: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        skill: { type: "string" },
                                        severity: {
                                            type: "string",
                                            enum: ["Low", "Medium", "High"]
                                        }
                                    },
                                    required: ["skill", "severity"],
                                    additionalProperties: false
                                }
                            },
                            preparationPlan: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        day: { type: "number" },
                                        focus: { type: "string" },
                                        tasks: { type: "string" }
                                    },
                                    required: ["day", "focus", "tasks"],
                                    additionalProperties: false
                                }
                            },
                            title: {
                                type: "string",
                                description: "Short job title based on the target job description"
                            }
                        },
                        required: [
                            "matchScore",
                            "technicalQuestions",
                            "behavioralQuestions",
                            "skillGaps",
                            "preparationPlan",
                            "title"
                        ],
                        additionalProperties: false
                    }
                }
            }
        });

        const report = JSON.parse(response.choices[0].message.content);
        // Ensure backwards compatibility with skillGap vs skillGaps
        if (!report.skillGaps && report.skillGap) {
            report.skillGaps = report.skillGap;
        }
        report.skillGap = report.skillGaps;

        return report;
    } catch (err) {
        console.error("GROQ_AI_ERROR :", err);
        throw err;
    }
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a highly professional, ATS-friendly resume for the candidate using the information provided below.

Resume Information:
${resume}

Self Description:
${selfDescription}

Target Job Description:
${jobDescription}

IMPORTANT INSTRUCTIONS:
1. Create a professional resume specifically tailored to the target job description.
2. Maintain complete factual accuracy.
3. Return ONLY the complete raw HTML content starting directly with <!DOCTYPE html> and ending with </html>.
`;

    const response = await groq.chat.completions.create({
        model: "openai/gpt-oss-120b",
        messages: [{ role: "user", content: prompt }]
    });

    const html = response.choices[0].message.content
        .replace(/```html/g, "")
        .replace(/```/g, "")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "")
        .replace(/\\t/g, "\t")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "")
        .trim();

    const pdfBuffer = await generatePdfFromHtml(html);
    return pdfBuffer;
}

/**
 * Evaluates candidate's spoken answer for a voice mock interview question.
 */
async function evaluateVoiceAnswer({ question, userAnswer, roleTitle, category }) {
    const prompt = `
Target Role: ${roleTitle}
Category: ${category || 'Technical'}
Interview Question: "${question}"
Candidate Answer Transcript: "${userAnswer || 'No response provided.'}"

Evaluate the candidate's spoken response thoroughly.
Provide:
1. Score out of 10 (integer from 0 to 10).
2. Constructive detailed feedback explaining what was good and how to improve.
3. List of 1-3 key strengths demonstrated in the response.
4. List of 1-3 observed weaknesses or missing key points.
5. An ideal/suggested answer highlighting key points to cover.
`;

    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: "You are an expert technical and behavioral interviewer evaluating candidate interview responses. Return a clean JSON object following the schema."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "answer_evaluation",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            score: { type: "number", description: "Score between 0 and 10" },
                            feedback: { type: "string", description: "Detailed feedback on the response" },
                            strengths: { type: "array", items: { type: "string" } },
                            weaknesses: { type: "array", items: { type: "string" } },
                            suggestedAnswer: { type: "string", description: "A high-quality model answer" }
                        },
                        required: ["score", "feedback", "strengths", "weaknesses", "suggestedAnswer"],
                        additionalProperties: false
                    }
                }
            }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (err) {
        console.error("EVALUATE_VOICE_ANSWER_ERROR:", err);
        return {
            score: 6,
            feedback: "Answer received. " + (userAnswer ? "Good effort answering." : "No verbal answer detected."),
            strengths: ["Attempted response"],
            weaknesses: ["Could be more detailed and structured"],
            suggestedAnswer: "A complete response should clearly explain core concepts, state concrete examples, and discuss trade-offs."
        };
    }
}

/**
 * Dynamically generates adaptive next interview question based on previous performance.
 */
async function generateNextVoiceQuestion({ roleTitle, skillGaps, previousQuestions, lastAnswer, lastScore, lastWeaknesses }) {
    let adaptationDirective = "Select an insightful technical or behavioral question suitable for the candidate's target role.";
    if (lastScore !== undefined && lastScore !== null) {
        if (lastScore < 6) {
            adaptationDirective = `ADAPTATION: The candidate struggled on the previous question (score ${lastScore}/10). Ask a follow-up or simpler foundational question on the same topic/skill gap to test fundamental understanding.`;
        } else if (lastScore >= 8) {
            adaptationDirective = `ADAPTATION: The candidate performed strongly on the previous question (score ${lastScore}/10). Increase the difficulty, ask a complex architectural/scenario-based or deeper technical question to challenge them.`;
        } else {
            adaptationDirective = `ADAPTATION: The candidate gave a moderate answer (score ${lastScore}/10). Ask a balanced question testing another key area or skill gap.`;
        }
    }

    const prompt = `
Target Role: ${roleTitle}
Skill Gaps identified: ${JSON.stringify(skillGaps || [])}
Previous Questions Asked: ${JSON.stringify(previousQuestions || [])}
Last Answer Given: ${lastAnswer ? `"${lastAnswer}"` : "None"}
Last Answer Score: ${lastScore !== undefined ? lastScore : "N/A"}
Last Weaknesses: ${JSON.stringify(lastWeaknesses || [])}

${adaptationDirective}

Return a single JSON object containing:
- question: The exact text of the question to ask the candidate verbally.
- category: Technical, Behavioral, or System Design.
- intention: What this question assesses.
- targetSkill: The specific skill/topic being tested.
`;

    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "system",
                    content: "You are an adaptive AI interviewer creating tailored interview questions dynamically based on candidate performance. Return a valid JSON object."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "next_question",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            question: { type: "string" },
                            category: { type: "string", enum: ["Technical", "Behavioral", "System Design", "General"] },
                            intention: { type: "string" },
                            targetSkill: { type: "string" }
                        },
                        required: ["question", "category", "intention", "targetSkill"],
                        additionalProperties: false
                    }
                }
            }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (err) {
        console.error("GENERATE_NEXT_QUESTION_ERROR:", err);
        return {
            question: `Could you describe a challenging project you built as a ${roleTitle} and how you solved the hardest technical problem in it?`,
            category: "Technical",
            intention: "Assess problem solving and practical experience",
            targetSkill: "Problem Solving"
        };
    }
}

module.exports = {
    generateInterviewReport,
    generateResumePdf,
    evaluateVoiceAnswer,
    generateNextVoiceQuestion
};