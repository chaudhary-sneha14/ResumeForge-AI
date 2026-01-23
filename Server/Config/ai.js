import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
    baseURL:process.env.OpenAI_BASE_URL
});
export default ai

// Cover Letter Generator

// Skill Gap Planner

// Progress Tracking