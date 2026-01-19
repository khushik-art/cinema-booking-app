import React, { useEffect, useState } from "react";
import Axios from "axios";
import MovieCard from "./MovieCard";
import TheaterList from "./TheaterList";

const MainContent = () => {
  const [activeTab, setActiveTab] = useState("movie");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await Axios.get(
        "/api/movies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "movie") {
      fetchMovies();
    }
  }, [activeTab]);

  return (
    <section className="max-w-[1150px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-sky-600 mb-2">
        Now Showing
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setActiveTab("movie")}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === "movie"
              ? "bg-sky-500 text-white"
              : "border border-sky-500 text-sky-500"
          }`}
        >
          Movie
        </button>

        <button
          onClick={() => setActiveTab("theater")}
          className={`px-6 py-2 rounded-md text-sm font-medium ${
            activeTab === "theater"
              ? "bg-sky-500 text-white"
              : "border border-sky-500 text-sky-500"
          }`}
        >
          Theater
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === "movie" && (
          <>
            {loading ? (
              <p className="text-center">Loading movies...</p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.name}
                    image={movie.image}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "theater" && <TheaterList />}
      </div>
    </section>
  );
};

export default MainContent;