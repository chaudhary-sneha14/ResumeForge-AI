import ai from "../Config/ai.js";
import coverLetterModel from "../Model/coverLetterModel.js";
import SkillGapModel from "../Model/SkillGapModel.js";
import Resume from "../Model/resumeModel.js";

export const generateCoverLetter = async (req, res) => {
  try {
    console.log("🔥 NEW COVER LETTER CONTROLLER HIT");
    console.log("COVER LETTER BODY:", req.body);

    const { resumeId, jobDescription, jobTitle, company } = req.body;

    if (!resumeId || !jobDescription?.trim() || !jobTitle?.trim()) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔹 Fetch resume from DB
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 🔹 AI call (NO resumeText, NO pdf-parse)
    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content:
            "You are an expert recruiter and career coach. Write a professional, concise, ATS-friendly cover letter. Keep it 3–4 short paragraphs. Avoid buzzwords and generic phrases.",
        },
        {
          role: "user",
          content: `
Job Title: ${jobTitle}
Company: ${company || "Not specified"}

Resume Title: ${resume.title}
Resume File URL: ${resume.fileUrl}

Job Description:
${jobDescription}
          `,
        },
      ],
    });

    const coverLetter = response.choices[0].message.content;

    if (!coverLetter?.trim()) {
      return res.status(500).json({ message: "AI returned empty response" });
    }

    // 🔹 Save cover letter
    const savedCoverLetter = await coverLetterModel.create({
      userId: req.userId,
      resumeId,
      jobTitle,
      company,
      coverLetterText: coverLetter,
    });

    return res.status(200).json({
      success: true,
      coverLetter: savedCoverLetter.coverLetterText,
      coverLetterId: savedCoverLetter._id,
    });
  } catch (error) {
    console.error("AI Error:", error);
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI rate limit reached. Please wait a minute and try again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI service failed. Please try again later.",
    });
  }
};

//------------------------------------------------------------

// controllers/skillGapController.js

/* ---------------- ANALYZE SKILL GAP ---------------- */
export const generateSkillGap = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;

    if (!resumeId || !jobDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume and job description are required",
      });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // -------- Resume text sent to AI --------
    const resumeText = `
Title: ${resume.title || ""}
Summary: ${resume.summary || ""}
Skills: ${resume.skills?.join(", ") || ""}
`;

    const response = await ai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "system",
          content: `
Return ONLY valid JSON:

{
  "matchedSkills": ["string"],
  "missingSkills": [
    {
      "skill": "string",
      "priority": "High | Medium | Low",
      "learningPath": "string"
    }
  ]
}
`,
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
      response_format: { type: "json_object" },
    });

    let data;
    try {
      data = JSON.parse(response.choices[0].message.content);
    } catch {
      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON",
      });
    }

    // -------- SIMPLE FIX: FILTER DUPLICATE SKILLS --------
    const resumeSkillsLower = (resume.skills || []).map((s) =>
      s.toLowerCase()
    );

    const filteredMissingSkills = (data.missingSkills || []).filter(
      (item) =>
        !resumeSkillsLower.some((skill) =>
          item.skill.toLowerCase().includes(skill)
        )
    );

    // -------- FINAL RESPONSE --------
    return res.status(200).json({
      success: true,
      data: {
        matchedSkills: Array.isArray(data.matchedSkills)
          ? data.matchedSkills
          : [],
        missingSkills: filteredMissingSkills,
      },
    });
  } catch (error) {
    console.error("Skill Gap Error:", error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI rate limit reached. Please try again shortly.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Skill gap analysis failed",
    });
  }
};

/* ---------------- SAVE SKILL GAP PLAN ---------------- */
export const saveSkillGapPlan = async (req, res) => {
  try {
    const { missingSkills, jobTitle } = req.body;

    if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No skills provided",
      });
    }

    const plans = missingSkills.map(skill => ({
      userId: req.userId,
      skill: skill.skill,
      priority: skill.priority,
      learningPath: skill.learningPath,
      status: "pending",
      sourceJobTitle: jobTitle || "Not specified",
    }));

    await SkillGapModel.insertMany(plans);

    return res.status(201).json({
      success: true,
      message: "Skill plan saved successfully",
    });

  } catch (error) {
    console.error("Save Skill Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save skill plan",
    });
  }
};

/* ---------------- GET SKILL GAPS ---------------- */
export const getSkillGaps = async (req, res) => {
  const skills = await SkillGapModel.find({
    userId: req.userId,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: skills,
  });
};

/* ---------------- UPDATE SKILL STATUS ---------------- */
export const updateSkillStatus = async (req, res) => {
  const { status } = req.body;

  const updated = await SkillGapModel.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Skill not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: updated,
  });
};

/* ---------------- DELETE SKILL GAP ---------------- */
export const deleteSkillGap = async (req, res) => {
  try {
    const deleted = await SkillGapModel.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Skill removed from progress",
    });

  } catch (error) {
    console.error("Delete Skill Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete skill",
    });
  }
};
