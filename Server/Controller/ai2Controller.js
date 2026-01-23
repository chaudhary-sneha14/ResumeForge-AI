import ai from "../Config/ai.js";
import coverLetterModel from "../Model/coverLetterModel.js";
import SkillGapModel from "../Model/SkillGapModel.js";

export const generateCoverLetter = async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle, company } = req.body;

    if (!resumeText || !jobDescription || !jobTitle) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert recruiter and career coach. Write a professional, concise, ATS-friendly cover letter. Keep it 3–4 short paragraphs. Match the candidate’s skills with the job description. Avoid buzzwords, fluff, or generic phrases. Only return the cover letter text.",
        },
        {
          role: "user",
          content: `
Job Title: ${jobTitle}
Company: ${company || "Not specified"}

Resume:
${resumeText}

Job Description:
${jobDescription}
          `,
        },
      ],
    });

    const coverLetter = response.choices[0].message.content;


    if (!coverLetter || coverLetter.trim() === "") {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    // ✅ USING MODEL HERE
    const savedCoverLetter = await coverLetterModel.create({
      userId:req.userId,
      jobTitle,
      company,
      coverLetterText:coverLetter,
    });

    return res.status(200).json({
      success: true,
      coverLetter: savedCoverLetter.coverLetterText,
      coverLetterId: savedCoverLetter._id,
    });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//------------------------------------------------------------

export const generateSkillGap = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter. Analyze the resume and job description. Return strictly valid JSON with two keys: matchedSkills (array of strings) and missingSkills (array of objects). Each missingSkills object must include skill, priority (High, Medium, Low), reason, and learningPath. Do not include any explanation outside JSON.",
        },
        {
          role: "user",
          content: `
Resume:
${resumeText}

Job Description:
${jobDescription}
          `,
        },
      ],
    });

    const skillGapData = JSON.parse(response.choices[0].message.content);

    return res.status(200).json({
      success: true,
      data: skillGapData,
    });
  } catch (error) {
    console.error("Skill Gap Error:", error);
    return res.status(500).json({ message: error.message });
  }
};

//--------------------------------generateSkillGapPlan-----------------------
export const generateSkillGapPlan = async (req, res) => {
  try {
    const { missingSkills, jobTitle } = req.body;

    if (!missingSkills || !Array.isArray(missingSkills)) {
      return res.status(400).json({ message: "Missing skills required" });
    }

    const plans = missingSkills.map((item) => ({
      userId: req.userId,
      skill: item.skill,
      priority: item.priority,
      reason: item.reason,
      learningPath: item.learningPath,
      level: "beginner",
      status: "pending",
      sourceJobTitle: jobTitle,
    }));

    const savedPlans = await SkillGapModel.insertMany(plans);

    res.status(201).json({
      success: true,
      skills: savedPlans,
    });
  } catch (error) {
    res.status(500).json({ message: "Skill gap generation failed" });
  }
};

//---------------------------get skill gap----------------------------

export const getSkillGaps = async (req, res) => {
  const skills = await SkillGapModel.find({ userId: req.userId });
  res.status(200).json(skills);
};

//-----------------update llevel status-------------------
export const updateSkillStatus = async (req, res) => {
  const { status, level } = req.body;

  const updated = await SkillGapModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status, level },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Skill not found" });
  }

  res.status(200).json(updated);
};
