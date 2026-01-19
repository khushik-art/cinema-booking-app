import React from "react";
import Homepage from "./components/homepage/Homepage";
import Login from "./components/login/Login";
import Register from "./components/login/register";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MovieDetails from "./components/pages/MovieDetails";
import TheaterDetails from "./components/pages/TheaterDetails";
import TheaterList from "./components/homepage/TheaterList";
import SelectSeats from "./components/pages/SelectSeats";
import BookingSummary from "./components/pages/BookingSummary";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import MyTicket from "./components/pages/MyTicket";
import Tickets from "./components/homepage/Tickets";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Homepage />
          </ProtectedRoute>
        }
      />
      <Route path="/movie/:movieId" element={<MovieDetails />} />
      <Route path="/theaters" element={<TheaterList />} />
      <Route path="/theaters/:theaterId" element={<TheaterDetails />} />
      <Route path="/select-seats/:showtimeId" element={<SelectSeats />} />
      <Route path="/booking-summary" element={<BookingSummary />} />
      <Route path="/success" element={<PaymentSuccess />} />
      <Route path="/my-ticket" element={<MyTicket />} />
      <Route path="/tickets" element={<Tickets />} />
    </Routes>
  );
};

export default App;
