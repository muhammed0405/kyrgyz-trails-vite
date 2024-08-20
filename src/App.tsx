/** @format */

import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./styles/global.scss";

// Components
import Header from "./components/common/header";
import ProtectedRoute from "./components/ProtectedRout/ProtectedRoute";

// Pages
import AddTour from "./pages/guide_pages/add_tour";
import GuideTours from "./pages/guide_pages/guide_tours";
import Home from "./pages/Home";
import Hotels from "./pages/hotels";
import RegionDetails from "./pages/region_details";
import Restaurants from "./pages/restaurants";
import TourDetails from "./pages/tour_details";
import Tours from "./pages/tours";

// Auth Pages
import VerifyEmailPage from "./auth/authentication/VerifyEmail";
import Login from "./auth/login_user";
import Register from "./auth/register_user";
import ProtectedRouteAdmin from "./components/ProtectedRout/ProtectedRouteAdmin.tsx";
import Bookings from "./pages/bookigs";
import Dashboard from "./pages/dashboard";
import DeleteTour from "./pages/delete/index.tsx";
import MyTours from "./pages/guide_pages/my_tours";
import UpdateTour from "./pages/guide_pages/update_tour";
import { UseTypedDispatch } from "./Redux/customHooks/useTypedDispatch";
import RequestEmailPass from "./auth/RequestEmailPass.tsx";
import ResetPass from "./auth/resetPass/index.tsx";

function App() {
  const { checkAuthState } = UseTypedDispatch();

  useEffect(() => {
    checkAuthState();
  }, []);
  return (
    <div>
      <Header />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />

        <Route path="/hotels" element={<Hotels />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/my_tours" element={<MyTours />} />
        <Route path="/guide_tours" element={<GuideTours />} />
        <Route path="/region_details/:id" element={<RegionDetails />} />
        <Route path="/tour_details/:id" element={<TourDetails />} />
        {/* Auth Routes */}
        <Route path="/auth/register_user" element={<Register />} />
        <Route path="/auth/login_user" element={<Login />} />
        <Route path="/request-password" element={<RequestEmailPass />} />
        <Route path="/reset-password" element={<ResetPass />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/verify-email/" element={<VerifyEmailPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my_bookings_guide" element={<Bookings />} />
          <Route path="/update-tour/:tourId" element={<UpdateTour />} />
          {/* Other protected routes */}
        </Route>
        <Route path="/add_tour" element={<AddTour />} />

        <Route element={<ProtectedRouteAdmin />}>
          <Route path="/delete" element={<DeleteTour />} />
        </Route>

        {/* Add more protected routes as needed */}
      </Routes>
    </div>
  );
}

export default App;
