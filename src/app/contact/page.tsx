export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl w-full bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-center text-gray-700 leading-relaxed mb-8">
            We&apos;d love to hear from you! Reach out to us using the contact
            information below.
          </p>
          <div className="space-y-8">
            <div className="flex items-center justify-left space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Phone</h2>
                <p className="text-gray-600">(123) 456-7890</p>
              </div>
            </div>

            <div className="flex items-center justify-left space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">Email</h2>
                <p className="text-gray-600">contact@appname.com</p>
              </div>
            </div>
            <div className="flex items-center justify-left space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-gray-800"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  Address
                </h2>
                <p className="text-gray-600">
                  123 Main St, Boston, MA, United States
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5"></div>
          <div className="flex flex-col justify-center items-center mt-4 bg-white shadow-md p-6">
            <div className="text-lg font-semibold text-center mb-4">
              Operating Hours
            </div>
            <ul className="space-y-2 text-gray-700 text-center">
              <li>
                <span className="font-semibold">Monday:</span> 7 AM to 4 PM
              </li>
              <li>
                <span className="font-semibold">Tuesday:</span> 7 AM to 4 PM
              </li>
              <li>
                <span className="font-semibold">Wednesday:</span> 7 AM to 4 PM
              </li>
              <li>
                <span className="font-semibold">Thursday:</span> 7 AM to 4 PM
              </li>
              <li>
                <span className="font-semibold">Friday:</span> 7 AM to 4 PM
              </li>
              <li>
                <span className="font-semibold">Saturday:</span> Closed
              </li>
              <li>
                <span className="font-semibold">Sunday:</span> Closed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
