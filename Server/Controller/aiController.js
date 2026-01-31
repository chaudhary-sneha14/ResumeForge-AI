import ai from "../Config/ai.js";
// import {v2 as cloudinary} from 'cloudinary'
import { connectCloudinary } from "../Config/cloudinary.js";
import Resume from "../Model/resumeModel.js";

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1–2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Only return the text — no options, lists, or explanations.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({
      success: true,
      enhancedContent,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//controller to enhance job description
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1–2 sentences highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible . Make it compelling and ATS-friendly. Only return the text — no options, lists, or explanations or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;

    return res.status(200).json({
      success: true,
      enhancedContent,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//controller for uploading resume to database





import fs from "fs";

export const uploadResume = async (req, res) => {
  const cloudinary = connectCloudinary();
  try {
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({
        success: false,
        message: "Resume file not attached"
      });
    }

    // Upload PDF to Cloudinary using file path
    const pdfUpload = await cloudinary.uploader.upload(pdfFile.path, {
  folder: "resumes",
  resource_type: "image",
  format: "pdf",
});

    // Delete local temp file
    fs.unlinkSync(pdfFile.path);

    const newResume = await Resume.create({
      userId: req.userId,
      title: pdfFile.originalname,
      fileUrl: pdfUpload.secure_url
    });

    return res.status(201).json({
      success: true,
      resume: newResume
    });

  } catch (error) {
    console.error("Resume upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//------------------get resume--------------
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//tailor Resume acc to job description
export const tailorResumeToJob = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const { resumeId } = req.params;

    if (!jobDescription) {
      return res.status(400).json({ message: "Job description is required" });
    }
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Ownership check
    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not your resume" });
    }

    const prompt = `
You are an ATS and resume expert.

Tasks:
- Rewrite summary for the job
- Rewrite experience bullets for the job
- Reorder skills by relevance
- Find missing important keywords

Return ONLY valid JSON:

{
  "tailoredSummary": "",
  "tailoredExperience": [
    {
      "company": "",
      "position": "",
      "description": ""
    }
  ],
   "tailoredProjects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "reorderedSkills": [],
  "missingKeywords": []
}

Resume:
    ${JSON.stringify(resume, null, 2)}


Job Description:
${jobDescription}
`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    let tailoredData;
    try {
      tailoredData = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: "Invalid JSON from AI" });
    }

    res.status(200).json({
      success: true,
      data: tailoredData,
    });
  } catch (error) {
    console.error("Tailor Error:", error);
    res.status(500).json({ message: "Resume tailoring failed" });
  }
};

//--------------ATS Keyword Gap Analyzer-----------
export const keywordGapAnalyzer = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const { resumeId } = req.params;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required",
      });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({
        message: "Not your resume",
      });
    }

    // ---------- AI ANALYSIS ----------
    const prompt = `
You are an ATS system.

Tasks:
1) Extract important keywords from job description.
2) Check which keywords are missing from resume.
3) Find weak words.
4) Suggest strong action verbs.

Return ONLY valid JSON:

{
  "missingKeywords": [],
  "weakWords": [],
  "strongAlternatives": []
}

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}
`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        message: "AI returned empty response",
      });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        message: "Invalid JSON from AI",
      });
    }

    const missingKeywords = data.missingKeywords || [];
    const weakWords = data.weakWords || [];
    const strongAlternatives = data.strongAlternatives || [];

    // ---------- SKILL MATCH ENGINE ----------
    const resumeText = JSON.stringify(resume).toLowerCase();
    const jdText = jobDescription.toLowerCase();

    // tech skill dictionary
    const techKeywords = [
      "node", "nodejs", "express", "react",
      "mongodb", "mysql", "javascript",
      "typescript", "docker", "kubernetes",
      "redis", "aws", "gcp", "azure",
      "api", "rest", "graphql",
      "microservices", "jwt", "oauth",
      "sql", "nosql", "backend",
      "frontend", "fullstack",
      "python", "machine learning",
      "tensorflow", "pytorch",
      "nlp", "data science"
    ];

    // skills required in JD
    const requiredSkills = techKeywords.filter(skill =>
      jdText.includes(skill)
    );

    let matchedSkills = 0;

    requiredSkills.forEach(skill => {
      if (resumeText.includes(skill)) {
        matchedSkills++;
      }
    });

    // match percentage
    const skillMatchPercent =
      requiredSkills.length > 0
        ? matchedSkills / requiredSkills.length
        : 0;

    // score out of 100
    const skillScore = skillMatchPercent * 100;

    // ---------- WEAK WORD PENALTY ----------
    const weakPenalty = Math.min(
      weakWords.length * 2,
      20
    );

    // ---------- FINAL ATS SCORE ----------
    let atsScore = skillScore - weakPenalty;

    // clamp score
    atsScore = Math.max(
      10,
      Math.min(100, Math.round(atsScore))
    );

    // ---------- SAVE SCORE ----------
    await Resume.findByIdAndUpdate(resumeId, {
      atsScore,
    });

    res.status(200).json({
      success: true,
      data: {
        missingKeywords,
        weakWords,
        strongAlternatives,
      },
      atsScore,
    });

  } catch (error) {
    console.error("Keyword Gap Error:", error);

    res.status(500).json({
      message: "Keyword analysis failed",
    });
  }
};

//--------------generateInterviewQuestions-----------
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const { resumeId } = req.params;

    if (!jobDescription) {
      return res
        .status(400)
        .json({ success: false, message: "Job description is required" });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return res
        .status(404)
        .json({ success: false, message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.userId) {
      return res
        .status(403)
        .json({ success: false, message: "Not your resume" });
    }

    // ✅ UPDATED PROMPT
    const prompt = `
You are a professional interviewer.

Generate interview questions AND answers.

Return ONLY valid JSON in this format:

{
  "technical": [
    { "question": "", "answer": "" }
  ],
  "behavioral": [
    { "question": "", "answer": "" }
  ],
  "projectBased": [
    { "question": "", "answer": "" }
  ]
}

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription || "Not provided"}
`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content;

    if (!raw) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty response",
      });
    }

    let data;

    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON from AI",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Interview AI Error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI rate limit reached. Please wait a minute and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI service failed.",
    });
  }
};

