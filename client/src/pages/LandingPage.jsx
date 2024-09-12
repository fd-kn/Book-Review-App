import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Welcome to Book Reviews!</h1>
        <p className="text-xl text-gray-600 mb-8">Leave reviews on all sorts of books and comics!</p>
        <div className="space-y-4 space-x-2">
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
