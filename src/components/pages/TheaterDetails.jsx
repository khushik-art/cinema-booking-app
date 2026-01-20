import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../homepage/Navbar";
import { useEffect, useState } from "react";
import Axios from "axios";
import SeatCountModal from "./SeatCountModal";
import api from "../../api";

const API = "/api";

const TheaterDetails = () => {
  const { theaterId } = useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loadingTheater, setLoadingTheater] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);

  // ✅ SINGLE SOURCE OF TRUTH
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState(null);

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

  /* ---------------- FETCH THEATER ---------------- */
  useEffect(() => {
    const fetchTheater = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`${API}/theaters/${theaterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTheater(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTheater(false);
      }
    };

    fetchTheater();
  }, [theaterId]);

  /* ---------------- FETCH SHOWS ---------------- */
  useEffect(() => {
    if (!theaterId || !selectedDate) return;

    const fetchShows = async () => {
      setLoadingMovies(true);
      try {
        const token = localStorage.getItem("token");
        const res = await api.get(`${API}/theaters/${theaterId}/shows`, {
          params: { date: selectedDate },
          headers: { Authorization: `Bearer ${token}` },
        });

        setMovies(res.data.data || []);
        setSelectedMovie(null);
        setSelectedShowtime(null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMovies(false);
      }
    };

    fetchShows();
  }, [theaterId, selectedDate]);

  if (loadingTheater) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-20 text-gray-500">Loading theater...</p>
      </>
    );
  }

  if (!theater) {
    return (
      <>
        <Navbar />
        <p className="text-center mt-20 text-red-500">Theater not found</p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-white to-sky-100">
        <div className="max-w-[1100px] mx-auto px-6 py-10 space-y-10">
          {/* HEADER */}
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-sky-600 mb-3"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-bold text-sky-600">{theater.name}</h1>
            <p className="text-sm text-gray-500">📍 {theater.location}</p>
          </div>

          {/* DATE SELECTOR */}
          <div className="flex gap-3 overflow-x-auto">
            {getNext7Days().map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
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

          {/* MOVIES */}
          <div className="space-y-8">
            <h2 className="text-lg font-semibold">Movies Playing</h2>

            {loadingMovies ? (
              <p className="text-gray-400">Loading movies...</p>
            ) : movies.length === 0 ? (
              <p className="text-gray-400">No movies available</p>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex justify-between items-start border-b pb-6"
                >
                  {/* LEFT */}
                  <div>
                    <h3 className="text-sky-600 font-semibold">{movie.name}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {movie.languages.join(", ")} • {movie.duration} mins
                    </p>

                    {/* SHOWTIMES */}
                    <div className="flex flex-wrap gap-3 mt-4">
                      {movie.showTimes.map((st) => {
                        const isSelected =
                          selectedMovie?.id === movie.id &&
                          selectedShowtime?.id === st.id;

                        return (
                          <button
                            key={st.id}
                            onClick={() => {
                              setSelectedMovie(movie);
                              setSelectedShowtime(st);
                            }}
                            className={`px-3 py-1 border rounded-lg text-sm transition ${
                              isSelected
                                ? "bg-sky-600 text-white border-sky-600"
                                : "bg-white text-gray-700 hover:bg-sky-50"
                            }`}
                          >
                            {new Date(st.startTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <button
                    disabled={
                      selectedMovie?.id !== movie.id || !selectedShowtime
                    }
                    onClick={() => setIsSeatModalOpen(true)}
                    className={`px-5 py-2 rounded-lg border font-medium transition ${
                      selectedMovie?.id === movie.id && selectedShowtime
                        ? "bg-white text-sky-600 border-sky-600 hover:bg-sky-50"
                        : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Book Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ✅ SINGLE MODAL (GLOBAL) */}
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
              movieTitle: movies.name,
              date: selectedDate,
              time: selectedShowtime.startTime,
            },
          });
        }}
      />
    </>
  );
};

export default TheaterDetails;
