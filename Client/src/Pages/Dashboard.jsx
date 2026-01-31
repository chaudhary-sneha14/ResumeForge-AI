import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../Component/Header";
import { Card } from "../Component/Card";
import { AppContext } from "../Context/AppContext";

export const Dashboard = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Prevent call without token
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${backendUrl}/api/resume/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [backendUrl, token]);

  if (loading || !data) {
    return (
      <>
        <Header
          title="Dashboard"
          subtitle="Track your resume progress and insights"
        />
        <p className="text-gray-500">Loading dashboard...</p>
      </>
    );
  }

  const { counts, ats, recentActivity } = data;

  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Track your resume progress and insights"
      />

      {/* COUNTS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
        <Card>
          <p className="text-sm text-gray-500">Resumes</p>
          <p className="text-2xl font-semibold mt-2">
            {counts.resumeCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Avg ATS</p>
          <p className="text-2xl font-semibold mt-2">
            {ats.avgAtsScore !== null
              ? `${ats.avgAtsScore}%`
              : "–"}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Skill Gaps</p>
          <p className="text-2xl font-semibold mt-2">
            {counts.skillGapCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Cover Letters</p>
          <p className="text-2xl font-semibold mt-2">
            {counts.coverLetterCount}
          </p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">
            Job Applications
          </p>
          <p className="text-2xl font-semibold mt-2">
            {counts.jobApplicationCount}
          </p>
        </Card>
      </div>

      {/* ATS INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <h3 className="text-lg font-medium mb-4">
            ATS Insights
          </h3>

          <div className="space-y-3 text-sm">
            <p>
              <span className="text-gray-500">
                Average ATS Score:
              </span>{" "}
              <span className="font-medium">
                {ats.avgAtsScore !== null
                  ? `${ats.avgAtsScore}%`
                  : "Not generated"}
              </span>
            </p>

            <p>
              <span className="text-gray-500">
                Best Resume ATS:
              </span>{" "}
              <span className="font-medium">
                {ats.bestResume
                  ? `${ats.bestResume.atsScore}%`
                  : "–"}
              </span>
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium mb-4">
            ATS Distribution
          </h3>

          <div className="space-y-2 text-sm">
            <p>
              Weak (&lt; 60):{" "}
              <span className="font-medium">
                {ats.distribution.weak}
              </span>
            </p>

            <p>
              Average (60–74):{" "}
              <span className="font-medium">
                {ats.distribution.average}
              </span>
            </p>

            <p>
              Strong (75+):{" "}
              <span className="font-medium">
                {ats.distribution.strong}
              </span>
            </p>
          </div>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card>
        <h3 className="text-lg font-medium mb-4">
          Recent Activity
        </h3>

        {recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">
            No recent activity yet
          </p>
        ) : (
          <ul className="space-y-3 text-sm">
            {recentActivity.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.type}</span>
                <span className="text-gray-400">
                  {new Date(item.date).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
};
