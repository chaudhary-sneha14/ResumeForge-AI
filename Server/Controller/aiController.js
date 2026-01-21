import ai from "../Config/ai.js";
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

export const uploadResume = async (req, res) => {
  try {
   const{resumeText,title}=req.body
   const userId=req.userId

   if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt="You are an expert AI Agent to extract data from resume."
    const userPrompt=`extract data from this resume: ${resumeText} Provide data in the following JSON format with no additional text before or after:
    { 
     professional_summary:{type:String,default:''},
    skills: [{ type: String }],

    personal_info:{
        image:{type:String,default:''},
        full_name:{type:String,default:''},
        profession:{type:String,default:''},
        email:{type:String,default:''},
        phone:{type:String,default:''},
        location:{type:String,default:''},
        linkedin:{type:String,default:''},
        website:{type:String,default:''},
        github:{type:String,default:''},
    },
    experience:[
        {
            company:{type:String},
            position:{type:String},
            start_date:{type:String},
            end_date:{type:String},
            description:{type:String},
            is_current: { type: Boolean }
        }
    ],
    project:[
        {
            name:{type:String},
            type:{type:String},
            description:{type:String},
        }
    ],    
    achievement:[
        {
            name:{type:String},
            description:{type:String},
        }
    ],
     education:[
        {
            institution:{type:String},
            degree:{type:String},
            field:{type:String},
            graduation_date:{type:String},
            gpa:{type:String},
        }
    ]
    }`

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL ,
      messages: [
        {
          role: "system",
          content:
            systemPrompt
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format:{type:'json_object'}
    });

    const extractData = response.choices[0].message.content;
    const parseData=JSON.parse(extractData)
    const newResume=await Resume.create({userId,title,...parseData})

    res.json({resumeId:newResume._id})
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ message: error.message });
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
      return res.status(400).json({ message: "Job description is required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not your resume" });
    }

    const prompt = `
You are an ATS system.

Tasks:
1) From job description, extract important keywords.
2) Check which of those are missing from resume.
3) Find weak or generic words in resume (like: worked, helped, did, responsible for).
4) Suggest strong action verbs to replace weak words.

Return ONLY valid JSON:

{
  "missingKeywords": [],
  "weakWords": [],
  "strongAlternatives": []
}

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription}`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: "Invalid JSON from AI" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Keyword Gap Error:", error);
    res.status(500).json({ message: "Keyword analysis failed" });
  }
};
//--------------generateInterviewQuestions-----------
export const generateInterviewQuestions = async (req, res) => {
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

    if (resume.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Not your resume" });
    }

    const prompt = `
You are a professional interviewer.

Using the resume and job description (if provided):

Tasks:
- Generate technical questions based on skills and experience
- Generate behavioral questions based on experience
- Generate project-based questions based on listed projects

Return ONLY valid JSON:

{
  "technical": [],
  "behavioral": [],
  "projectBased": []
}

Resume:
${JSON.stringify(resume, null, 2)}

Job Description:
${jobDescription || "Not provided"}`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const raw = response.choices?.[0]?.message?.content;
    if (!raw) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(500).json({ message: "Invalid JSON from AI" });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Interview AI Error:", error);
    res.status(500).json({ message: "Interview generation failed" });
  }
};
