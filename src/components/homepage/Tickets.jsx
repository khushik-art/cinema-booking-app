import { useEffect, useState } from "react";
import Navbar from "../homepage/Navbar";

const BASE_URL =
  "http://ec2-13-201-98-117.ap-south-1.compute.amazonaws.com:3000";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (iso) =>
  new Date(iso).toDateString();

const Tickets = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming"); // upcoming | history

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const now = new Date();

  const filteredOrders = orders.filter((o) => {
    const showTime = new Date(o.showtime.startTime);
    return tab === "upcoming"
      ? showTime > now
      : showTime <= now;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">Loading tickets…</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-[1150px] mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              tab === "upcoming"
                ? "bg-sky-500 text-white"
                : "border border-sky-500 text-sky-500"
            }`}
          >
            Upcoming
          </button>

          <button
            onClick={() => setTab("history")}
            className={`px-6 py-2 rounded-md text-sm font-medium ${
              tab === "history"
                ? "bg-sky-500 text-white"
                : "border border-sky-500 text-sky-500"
            }`}
          >
            History
          </button>
        </div>

        {/* Cards */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No tickets found</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const seats = order.seatData.seats.map(
                (s) => `${s.row}${s.column}`
              );

              return (
                <div
                  key={order.id}
                  className="bg-white border border-sky-500 rounded-xl p-5 text-sm"
                >
                  <p className="text-sky-600 font-semibold">Date</p>
                  <p className="mb-4">
                    {formatDate(order.showtime.startTime)}
                  </p>

                  <p className="text-sky-600 font-semibold">Movie Title</p>
                  <p className="mb-4">
                    {order.showtime.movie.name}
                  </p>

                  <div className="flex justify-between mb-5">
                    <div>
                      <p className="text-sky-600 font-semibold">
                        Ticket ({seats.length})
                      </p>
                      <p>{seats.join(", ")}</p>
                    </div>

                    <div>
                      <p className="text-sky-600 font-semibold">Hours</p>
                      <p>{formatTime(order.showtime.startTime)}</p>
                    </div>
                  </div>

                  <button className="w-full py-2 border border-sky-600 text-sky-600 rounded-lg font-medium hover:bg-sky-600 hover:text-white transition">
                    Download Ticket
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Tickets;
