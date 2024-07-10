import { getJobListing } from "@/server/db/queries";

export default async function JobShowPage(props: { id: number }) {
  const job = await getJobListing(props.id);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8 m-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h2>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </div>
    </div>
  );
}
