import { useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-sky-100 px-4 text-center">
        <h1 className="text-7xl font-bold text-sky-600 mb-4">404</h1>

        <p className="text-xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </p>

        <p className="text-gray-500 mb-8 max-w-md">
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/home")}
          className="px-8 py-3 rounded-lg border border-sky-600 text-sky-600 font-medium hover:bg-sky-600 hover:text-white transition"
        >
          Go Back Home
        </button>
      </div>
    </>
  );
};

export default NotFound;
