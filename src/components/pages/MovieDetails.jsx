import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Axios from "axios";
import Navbar from "../homepage/Navbar";
import SeatCountModal from "./SeatCountModal";
import api from "../../api";

const API = "/api";

const MovieDetails = () => {
  //   const { theaterId } = useParams();
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  const [showtimesByTheater, setShowtimesByTheater] = useState({});
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);

  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // 🔵 Seat modal state
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

  /* ---------------- FETCH MOVIE ---------------- */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`/movies/${movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovie(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  /* ---------------- FETCH SHOWTIMES ---------------- */
  useEffect(() => {
    if (!selectedTheater || !selectedDate) return;

    const fetchShowtimes = async () => {
      setLoadingShowtimes(true);
      const token = localStorage.getItem("token");

      try {
        const res = await api.get(
          `/theaters/${selectedTheater.id}/shows`,
          {
            params: { date: selectedDate },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const movies = res.data?.data || [];
        const movieEntry = movies.find((m) => m.id === movieId);

        const enrichedShowtimes =
          movieEntry?.showTimes?.map((st) => ({
            ...st,
            screenId:
              st.screenId ?? movieEntry.screenId ?? selectedTheater.screenId,
          })) || [];

        setShowtimesByTheater({
          [selectedTheater.id]: enrichedShowtimes,
        });
      } catch (err) {
        console.error("Failed to fetch showtimes", err);
        setShowtimesByTheater({ [selectedTheater.id]: [] });
      } finally {
        setLoadingShowtimes(false);
      }
    };

    fetchShowtimes();
  }, [selectedTheater, selectedDate, movieId]);

  /* ---------------- DATE LIST ---------------- */
  const getNext7Days = () =>
    Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return {
        label: d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        }),
        value: d.toISOString().split("T")[0],
      };
    });

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Loading movie...</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100">
        <div className="max-w-[1200px] mx-auto px-6 py-10 flex gap-12">
          {/* LEFT */}
          <div className="flex-1 space-y-10">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-sky-600"
            >
              ← Back
            </button>

            {/* DATE */}
            <h2 className="text-xl font-semibold text-sky-600">Date</h2>
            <div className="flex gap-3 overflow-x-auto">
              {getNext7Days().map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelectedDate(d.value);
                    setSelectedShowtime(null);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    selectedDate === d.value
                      ? "bg-sky-600 text-white border-sky-600"
                      : "bg-white text-gray-600"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* THEATER */}
            <h2 className="text-xl font-semibold text-sky-600">Theater</h2>
            <div className="flex flex-wrap gap-3">
              {movie.theaters.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTheater(t);
                    setSelectedShowtime(null);
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm ${
                    selectedTheater?.id === t.id
                      ? "bg-sky-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  📍 {t.name}
                </button>
              ))}
            </div>

            {/* TIME */}
            <h2 className="text-xl font-semibold text-sky-600">Time</h2>

            {!selectedTheater ? (
              <p className="text-gray-400 text-sm">
                Select a theater to view showtimes
              </p>
            ) : loadingShowtimes ? (
              <p className="text-gray-400 text-sm">Loading showtimes...</p>
            ) : (showtimesByTheater[selectedTheater.id] || []).length === 0 ? (
              <p className="text-gray-400 text-sm">
                No shows available for selected date
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {showtimesByTheater[selectedTheater.id].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSelectedShowtime(st);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm ${
                      selectedShowtime?.id === st.id
                        ? "bg-sky-600 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {new Date(st.startTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="w-[350px] space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src={movie.image}
                alt={movie.name}
                className="w-full h-[480px] object-cover"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-sky-600">{movie.name}</h1>
              <p className="text-sm text-gray-500 mt-2">{movie.description}</p>

              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </p>
                <p>
                  <span className="font-medium">Language:</span>{" "}
                  {movie.languages?.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Type:</span> 2D
                </p>
              </div>
            </div>

            {/* BOOKING CARD */}
            {selectedTheater && selectedShowtime && (
              <div className="border rounded-2xl p-5 space-y-3 bg-white">
                <h3 className="text-lg font-semibold text-sky-600">
                  {selectedTheater.name}
                </h3>

                <p className="text-sm text-gray-600">
                  {new Date(selectedDate).toDateString()}
                </p>

                <p className="text-sm text-gray-600">
                  {new Date(selectedShowtime.startTime).toLocaleTimeString(
                    "en-US",
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </p>

                <button
                  onClick={() => setIsSeatModalOpen(true)}
                  className="w-full mt-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEAT COUNT MODAL */}
      <SeatCountModal
        isOpen={isSeatModalOpen}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        onClose={() => {
          setIsSeatModalOpen(false);
          setSelectedSeats(null);
        }}
        onConfirm={() => {
          setIsSeatModalOpen(false);

          navigate(`/select-seats/${selectedShowtime.id}`, {
            state: {
              seatCount: selectedSeats, // number
              movieTitle: movie.name,
              date: selectedDate,
              time: selectedShowtime.startTime,
            },
          });
        }}
      />
    </>
  );
};

export default MovieDetails;
