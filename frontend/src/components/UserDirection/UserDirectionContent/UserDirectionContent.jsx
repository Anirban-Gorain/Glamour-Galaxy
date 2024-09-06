import React from "react";

export default function UserDirectionContent({ handleClose }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff61]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={handleClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h1 className="text-2xl font-bold mb-4">Access Information</h1>
        <p className="text-gray-700 mb-2">
          Email: <strong>test@gmail.com</strong>
        </p>
        <p className="text-gray-700 mb-4">
          Password: <strong>Test@123</strong>
        </p>
        <p className="text-gray-700 mb-4">
          You can use the above email and password to check the application.
        </p>
        <p className="text-gray-500">
          Note: The site is hosted on a free web service (Render). It may take
          approximately 1 minute to load the backend server first time. Please
          be patient.
        </p>
      </div>
    </div>
  );
}
