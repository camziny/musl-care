import { getJobListings } from "@/server/db/queries";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import DeleteJobButton from "../_components/DeleteJobButton";

export default async function JobList() {
  const user = await currentUser();
  const jobs = await getJobListings();

  return (
    <div className="z-10 w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Job Listings</h1>
      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job.id}>
            <Link
              href={`/jobs/${job.id}`}
              className="text-xl font-semibold text-rose-600"
            >
              <div className="transform transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg bg-white shadow-md rounded-lg p-6">
                {job.title}
                <p className="text-gray-700 mt-2">{job.description}</p>
              </div>
            </Link>
            {user?.id === job.creatorUserId && (
              <DeleteJobButton jobId={job.id} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
