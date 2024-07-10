import { getJobListings } from "@/server/db/queries";
import Link from "next/link";
export default async function JobList() {
  const jobs = await getJobListings();
  return (
    <div className="z-10 w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Jobs</h1>
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white shadow-md rounded-lg p-6">
            <Link
              href={`/jobs/${job.id}`}
              className="text-xl font-semibold text-rose-600 hover:underline"
            >
              {job.title}
            </Link>
            <p className="text-gray-700 mt-2">{job.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
