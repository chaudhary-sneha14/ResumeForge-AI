
import { ExternalLink } from "lucide-react";

export default function ResumeBuilder() {
  const openResumeBuilder = () => {
    window.open(
      "https://resume-builder-client-jet.vercel.app",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="max-w-xl w-full bg-white rounded-xl shadow p-8 text-center space-y-6">
        
        <h1 className="text-2xl font-semibold text-gray-800">
          Resume Builder
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed">
          Create and manage your professional resume using our dedicated
          resume builder. This will open in a new tab.
        </p>

        <button
          onClick={openResumeBuilder}
          className="inline-flex items-center gap-2 px-6 py-3
                     bg-blue-600 text-white rounded-lg
                     hover:bg-blue-700 transition"
        >
          Open Resume Builder
          <ExternalLink className="w-4 h-4" />
        </button>

        <p className="text-xs text-gray-400">
          Opens in a new tab
        </p>
      </div>
    </div>
  );
}
