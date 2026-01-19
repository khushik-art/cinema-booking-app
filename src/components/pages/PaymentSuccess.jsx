import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get("session_id");

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 flex items-center justify-center px-4">
        <div className="flex flex-col items-center text-center">
          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-gray-900 mb-10">
            Payment Successful
          </h1>

          {/* SUCCESS ICON */}
          <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center mb-10">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* SESSION ID (TEMP) */}
          {sessionId && (
            <p className="text-[11px] text-gray-400 mb-8 break-all max-w-[320px]">
              Session ID: {sessionId}
            </p>
          )}

          {/* ACTIONS */}
          <button
            onClick={() =>
              navigate("/my-ticket", {
                state: {
                  sessionId,
                },
              })
            }
            className="w-[260px] mb-4 py-3 rounded-lg border border-sky-600 text-sky-600 font-medium hover:bg-sky-600 hover:text-white transition"
          >
            View Ticket
          </button>

          <button
            onClick={() => navigate("/home")}
            className="w-[260px] py-3 rounded-lg border border-gray-300 text-gray-400 cursor-not-allowed"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;
