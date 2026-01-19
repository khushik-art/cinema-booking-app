import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const SERVICE_CHARGE_RATE = 0.06;
const formatTime = (isoString) =>
  new Date(isoString).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // set true if you want AM/PM
  });

const BookingSummary = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const BASE_URL =
    "/api";

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const invalidSeat = seats.find((s) => !s.layoutType);
      if (invalidSeat) {
        alert("Seat data corrupted. Please reselect seats.");
        navigate(-1);
        return;
      }

      const payloadSeats = seats.map((s) => ({
        row: s.id.charAt(0),
        column: Number(s.id.slice(1)),
        layoutType: s.layoutType,
      }));

      const payload = {
        showtimeId,
        seatData: { seats: payloadSeats },
      };

      const res = await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.paymentUrl) {
        throw new Error(data.message || "Payment initiation failed");
      }

      // ✅ JUST REDIRECT — DO NOT TOUCH THE URL
      window.location.href = data.paymentUrl;
    } catch (err) {
      console.error("❌ Payment Error:", err);
      navigate("/failed");
    }
  };

  if (!state) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <p className="text-gray-500 mb-4">Invalid booking flow</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sky-600 underline"
          >
            Go back
          </button>
        </div>
      </>
    );
  }

  const { movieTitle, date, time, showtimeId, seats } = state;

  const seatIds = seats.map((s) => s.id);
  const seatCount = seats.length;

  const baseAmount = seats.reduce((sum, s) => sum + s.price, 0);
  const serviceCharge = Math.round(baseAmount * SERVICE_CHARGE_RATE);
  const totalAmount = baseAmount + serviceCharge;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 flex justify-center items-center px-4">
        <div className="w-[360px] bg-white border border-sky-500 rounded-2xl shadow-lg p-6">
          {/* HEADER */}
          <h2 className="text-xl font-bold text-sky-600 mb-6">
            Booking Detail
          </h2>

          {/* DETAILS */}
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <p className="text-gray-400">Movie Title</p>
              <p className="font-medium text-gray-700">{movieTitle}</p>
            </div>

            <div>
              <p className="text-gray-400">Date</p>
              <p className="font-medium text-gray-700">{date}</p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-gray-400">Ticket ({seatCount})</p>
                <p className="font-medium text-gray-700">
                  {seatIds.join(", ")}
                </p>
              </div>

              <div className="text-right">
                <p className="text-gray-400">Hours</p>
                <p className="font-medium text-gray-700">{formatTime(time)}</p>
              </div>
            </div>
          </div>

          {/* TRANSACTION */}
          <div className="mt-6 pt-4 border-t text-sm">
            <h3 className="text-sky-600 font-medium mb-3">
              Transaction Detail
            </h3>

            <div className="flex justify-between mb-2">
              <span>Seats ({seatCount})</span>
              <span>₹{baseAmount}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Service Charge (6%)</span>
              <span>₹{serviceCharge}</span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total payment</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* FOOTNOTE */}
          <p className="text-[11px] text-gray-400 mt-4">
            *Purchased ticket cannot be canceled
          </p>

          {/* ACTIONS */}
          <button
            className="w-full mt-5 py-3 rounded-lg border border-sky-600 text-sky-600 font-medium hover:bg-sky-600 hover:text-white"
            onClick={handlePayment}
          >
            Total Pay ₹{totalAmount} Proceed
          </button>

          <button
            className="w-full mt-3 py-3 rounded-lg border text-gray-400 hover:bg-gray-50 transition"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingSummary;
