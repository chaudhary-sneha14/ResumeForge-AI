import { useState } from "react";
import { Header } from "../Component/Header";
import { Card } from "../Component/Card";


export const UploadResume=()=> {
  const [resumes, setResumes] = useState([]);

  const handleFile=(file)=>{
    const fileUrl=URL.createObjectURL(file)
    window.open(fileUrl,"_blank")

  }

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setResumes((prev) => [
      ...prev,
      {
        name: file.name,
        date: new Date().toLocaleDateString(),
        file: file
      }
    ]);
  };

  return (
    <>
      <Header
        title="Upload Resume"
        subtitle="Upload and manage your resumes"
      />

      {/* Upload box */}
      <Card>
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer hover:border-blue-400 transition">
          <input
            type="file"
            accept=".pdf"
            onChange={handleUpload}
            className="hidden"
          />
          <p className="text-gray-700 font-medium">
            Click to upload your resume
          </p>
          <p className="text-sm text-gray-500 mt-1">
            PDF only
          </p>
        </label>
      </Card>

      {/* Uploaded resumes */}
      {resumes.length > 0 && (
        <div className="mt-6 space-y-4">
          {resumes.map((resume, index) => (
            <Card key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  {resume.name}
                </p>
                <p className="text-sm text-gray-500">
                  Uploaded on {resume.date}
                </p>
              </div>
              <button className="text-sm text-blue-600 font-medium"
                onClick={() => handleFile(resume.file)}>
                View
              </button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
