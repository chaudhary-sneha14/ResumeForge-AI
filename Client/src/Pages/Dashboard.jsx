import {Card} from "../Component/Card";
import { Header } from "../Component/Header";


export const Dashboard=() =>{
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Track your resume progress and insights"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <p className="text-sm text-gray-500">Resumes Uploaded</p>
          <p className="text-2xl font-semibold mt-2">0</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Avg ATS Score</p>
          <p className="text-2xl font-semibold mt-2">–</p>
        </Card>

        <Card>
          <p className="text-sm text-gray-500">Job Matches</p>
          <p className="text-2xl font-semibold mt-2">–</p>
        </Card>
      </div>
    </>
  );
}
