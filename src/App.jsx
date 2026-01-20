import { Routes, Route } from "react-router-dom";

import Login from "./components/login/Login";
import Register from "./components/login/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Homepage from "./components/homepage/Homepage";
import MovieDetails from "./components/pages/MovieDetails";
import TheaterDetails from "./components/pages/TheaterDetails";
import TheaterList from "./components/homepage/TheaterList";
import SelectSeats from "./components/pages/SelectSeats";
import BookingSummary from "./components/pages/BookingSummary";
import PaymentSuccess from "./components/pages/PaymentSuccess";
import MyTicket from "./components/pages/MyTicket";
import Tickets from "./components/homepage/Tickets";
import NotFound from "./components/pages/NotFound";

const App = () => {
  return (
    <Routes>
      {/* -------- PUBLIC ROUTES -------- */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* -------- PROTECTED ROUTES -------- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Homepage />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/theaters" element={<TheaterList />} />
        <Route path="/theaters/:theaterId" element={<TheaterDetails />} />
        <Route path="/select-seats/:showtimeId" element={<SelectSeats />} />
        <Route path="/booking-summary" element={<BookingSummary />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="/my-ticket" element={<MyTicket />} />
        <Route path="/tickets" element={<Tickets />} />
      </Route>

      {/* -------- 404 -------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
