import JobApplication from "../Model/JobApplication.js";

export const addJob = async (req, res) => {
  const { jobTitle, company, atsScore } = req.body;

  if (!jobTitle || !company) {
    return res.status(400).json({ message: "Job title and company required" });
  }

  const job = await JobApplication.create({
    userId: req.userId,
    jobTitle,
    company,
    atsScore,
  });

  res.status(201).json(job);
};

//--------------get job---------------
export const getJobs = async (req, res) => {
  const jobs = await JobApplication.find({ userId: req.userId });
  res.status(200).json(jobs);
};

//-----------------update job-----------
export const updateJobStatus = async (req, res) => {
  const { status } = req.body;

  const updated = await JobApplication.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ message: "Job not found" });
  }

  res.status(200).json(updated);
};
