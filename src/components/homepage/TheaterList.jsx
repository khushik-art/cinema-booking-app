import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

// const theaters = [
//   {
//     id: 1,
//     name: "The Crystal Theater",
//     address: "123 Cinema Lane, Movie Town, CA 90210",
//   },
//   {
//     id: 2,
//     name: "The Echoing Hall",
//     address: "123 Cinema Lane, Movie Town, CA 90210",
//   },
//   {
//     id: 3,
//     name: "The Dreamland Theater",
//     address: "123 Cinema Lane, Movie Town, CA 90210",
//   },
//   {
//     id: 4,
//     name: "The Enchanted Stage",
//     address: "123 Cinema Lane, Movie Town, CA 90210",
//   },
// ];

const TheaterList = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTheaters = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await Axios.get(
        "/api/theaters",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // API returns { data: [...] }
      setTheaters(response.data.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  if (loading) {
    return <p className="text-center">Loading theaters...</p>;
  }
  return (
    <div className="space-y-4">
      {theaters.map((theater) => (
        <div
          key={theater.id}
          onClick={() => navigate(`/theaters/${theater.id}`)}
          className="flex justify-between items-center
                 bg-sky-50 border border-sky-100
                 rounded-xl p-4
                 hover:bg-sky-100 transition cursor-pointer"
        >
          {/* Left content */}
          <div>
            <h3 className="text-sky-600 font-semibold text-lg">
              {theater.name}
            </h3>

            <div className="flex items-start gap-2 mt-1 text-gray-600 text-sm">
              {/* Location icon */}
              <span className="mt-[2px]">📍</span>
              <p>{theater.location}</p>
            </div>
          </div>

          {/* Right arrow */}
          <span className="text-sky-500 text-2xl font-light">›</span>
        </div>
      ))}
    </div>
  );
};

export default TheaterList;
