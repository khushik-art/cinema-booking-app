import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";

const BASE_URL =
  "/api";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const MyTicket = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthenticated");

        const res = await fetch(`${BASE_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Failed to load orders");

        const latestOrder = data[data.length - 1];
        if (!latestOrder) throw new Error("No ticket found");

        setOrder(latestOrder);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">Loading your ticket…</p>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">Ticket not found</p>
      </>
    );
  }

  const seats = order.seatData.seats.map((s) => `${s.row}${s.column}`);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100 flex flex-col items-center justify-center px-4">
        {/* TICKET CARD */}
        <div className="bg-white rounded-xl border border-sky-400 shadow-md px-6 py-7 w-[280px] text-sm">
          <div className="space-y-4">
            <div>
              <p className="text-sky-600 text-xs font-medium mb-1">Date</p>
              <p className="text-gray-700">
                {formatDate(order.showtime.startTime)}
              </p>
            </div>

            <div>
              <p className="text-sky-600 text-xs font-medium mb-1">
                Movie Title
              </p>
              <p className="text-gray-700 uppercase tracking-wide">
                {order.showtime.movie.name}
              </p>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-sky-600 text-xs font-medium mb-1">
                  Ticket ({seats.length})
                </p>
                <p className="text-gray-700">{seats.join(", ")}</p>
              </div>

              <div className="text-right">
                <p className="text-sky-600 text-xs font-medium mb-1">Hours</p>
                <p className="text-gray-700">
                  {formatTime(order.showtime.startTime)}
                </p>
              </div>
            </div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <button className="w-full mt-6 py-2 rounded-md border border-sky-600 text-sky-600 font-medium hover:bg-sky-600 hover:text-white transition">
            Download Ticket
          </button>
        </div>

        {/* BACK BUTTON (DISABLED LIKE INSPO) */}
        <button
          onClick={() => navigate("/home")}
          className="mt-10 px-10 py-2 rounded-md border text-gray-300"
        >
          Back to Homepage
        </button>
      </div>
    </>
  );
};

export default MyTicket;
