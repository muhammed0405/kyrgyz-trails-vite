/** @format */

import React, { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import "./styles/global.scss"

// Components
import Header from "./components/common/header"
import ProtectedRoute from "./components/ProtectedRout/ProtectedRoute"

// Pages
import Home from "./pages/Home"
import Tours from "./pages/tours"
import Restaurants from "./pages/restaurants"
import Hotels from "./pages/hotels"
import GuideTours from "./pages/guide_tours"
import UsersList from "./pages/users"
import RegionDetails from "./pages/region_details"
import TourDetails from "./pages/tour_details"
import AddTour from "./pages/add_tour"

// Auth Pages
import Register from "./auth/register_user"
import Login from "./auth/login_user"
import { UseTypedDispatch } from "./Redux/customHooks/useTypedDispatch"
import Dashboard from "./pages/dashboard"
import VerifyEmailPage from "./auth/authentication/VerifyEmail"
import MyTours from "./pages/my_tours"

function App() {
	const { checkAuthState } = UseTypedDispatch()

	useEffect(() => {
		checkAuthState()
	}, [])
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

				<Route path="/verify-email/" element={<VerifyEmailPage />} />
				{/* Protected Routes */}
				<Route element={<ProtectedRoute />}>
					<Route path="/dashboard" element={<Dashboard />} />
					{/* Other protected routes */}
				</Route>
				<Route path="/add_tour" element={<AddTour />} />
				{/* Add more protected routes as needed */}
			</Routes>
		</div>
	)
}

export default App
