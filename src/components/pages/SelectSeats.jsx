import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import Navbar from "../homepage/Navbar";

const API = "/api";

const safeParseLayout = (layout) => {
  try {
    return JSON.parse(layout) || [];
  } catch {
    return [];
  }
};

const getRowWeight = (rows = []) =>
  Math.max(...rows.map((r) => r.charCodeAt(0)));

const SelectSeats = () => {
  const { showtimeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const seatCount = state?.seatCount;
  const movieTitle = state?.movieTitle;
  const date = state?.date;
  const time = state?.time;

  const [sections, setSections] = useState([]);
  const [blockedSeats, setBlockedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  /* ---------------- FETCH SHOWTIME ---------------- */
  useEffect(() => {
    if (!showtimeId || !seatCount) {
      setInvalid(true);
      setLoading(false);
      return;
    }

    const fetchShowtime = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await Axios.get(`${API}/show-times/${showtimeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data?.data;
        if (!data?.screen) throw new Error("Invalid showtime");

        const layout = safeParseLayout(data.screen.layout);

        const seatSections = layout.map((section) => {
          const priceObj = data.price.find(
            (p) => p.layoutType === section.type
          );

          const [start, end] = section.layout.columns;

          return {
            type: section.type,
            price: priceObj?.price ?? 0,
            label: `₹${priceObj?.price ?? 0} ${section.type}`,
            rows: section.layout.rows,
            seatsPerRow: end - start + 1,
          };
        });

        const blocked = data.orders.flatMap((o) =>
          o.seatData.seats.map((s) => `${s.row}${s.column}`)
        );

        const sortedSections = [...seatSections].sort(
          (a, b) => getRowWeight(b.rows) - getRowWeight(a.rows)
        );

        setSections(sortedSections);
        setBlockedSeats(blocked);
      } catch (err) {
        console.error(err);
        setInvalid(true);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtime();
  }, [showtimeId, seatCount]);

  /* ---------------- SEAT TOGGLE ---------------- */
  const toggleSeat = (id, price, layoutType) => {
  if (blockedSeats.includes(id)) return;
  if (!layoutType) return; // ⛔ hard guard

  setSelectedSeats((prev) =>
    prev.find((s) => s.id === id)
      ? prev.filter((s) => s.id !== id)
      : prev.length < seatCount
      ? [...prev, { id, price, layoutType }]
      : prev
  );
};


  /* ---------------- TOTAL PRICE ---------------- */
  const totalPrice = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + s.price, 0),
    [selectedSeats]
  );

  /* ---------------- STATES ---------------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <p className="mt-20 text-center text-gray-500">Loading seats...</p>
      </>
    );
  }

  if (invalid) {
    return (
      <>
        <Navbar />
        <div className="mt-20 text-center">
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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100">
        <div className="max-w-[900px] mx-auto px-6 py-10">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-12">
            <button
              onClick={() => navigate(-1)}
              className="text-sky-600 text-2xl"
            >
              ←
            </button>
            <h1 className="text-3xl font-bold text-sky-600">Select Seat</h1>
          </div>

          {/* SECTIONS */}
          {sections.map((sec) => (
            <div key={sec.type} className="mb-14">
              <p className="text-sm text-gray-500 mb-3">{sec.label}</p>

              <div className="w-full h-px bg-gray-200 mb-6" />

              {sec.rows.map((row) => (
                <div key={row} className="flex justify-center gap-2 mb-3">
                  {Array.from({ length: sec.seatsPerRow }).map((_, i) => {
                    const id = `${row}${i + 1}`;
                    const blocked = blockedSeats.includes(id);
                    const selected = selectedSeats.some((s) => s.id === id);

                    return (
                      <button
                        key={id}
                        disabled={blocked}
                        onClick={() => toggleSeat(id, sec.price, sec.type)}
                        className={`w-10 h-8 rounded-md border text-xs transition
                          ${
                            blocked
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : selected
                              ? "bg-sky-600 text-white border-sky-600"
                              : "bg-white text-gray-600 border-gray-300 hover:border-sky-400"
                          }`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}

          {/* SCREEN INDICATOR */}
          <div className="mt-16 flex flex-col items-center">
            <div className="w-[65%] h-2 bg-gray-300 rounded-full" />
            <p className="text-xs text-gray-500 mt-2">
              All eyes this way please!
            </p>
          </div>

          {/* PAY BUTTON */}
          <div className="mt-12 flex justify-center">
            {/* PAY BUTTON */}
            <div className="mt-12 flex justify-center">
              <button
                onClick={() =>
                  navigate("/booking-summary", {
                    state: {
                      movieTitle,
                      date,
                      time,
                      showtimeId,
                      seats: selectedSeats, // [{ id, price }]
                      totalPrice,
                    },
                  })
                }
                disabled={selectedSeats.length !== seatCount}
                className={`px-12 py-3 rounded-lg font-medium transition
    ${
      selectedSeats.length === seatCount
        ? "border border-sky-600 text-sky-600 hover:bg-sky-600 hover:text-white"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
              >
                Pay ₹{totalPrice}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectSeats;
