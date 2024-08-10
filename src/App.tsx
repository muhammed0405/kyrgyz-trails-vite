/** @format */

import { Route, Routes } from "react-router-dom"
import "./styles/global.scss"
import Header from "./components/common/header"
import Tours from "./pages/tours"
import Restaurants from "./pages/restaurants"
import Hotels from "./pages/hotels"
import Home from "./pages/Home"
import GuideTours from "./pages/guide_tours"
import UsersList from "./pages/users"
import Register from "./auth/register_user"
import Login from "./auth/login_user"
import RegionDetails from "./pages/region_details"
import Auth from "./auth/authentication/Auth"
import TourDetails from "./pages/tour_details"
import AuthSecond from "./auth/authentication/SecondAuth"
import AddTour from "./pages/add_tour"

function App() {
	return (
		<div>
			<Header />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/tours" element={<Tours />} />

				<Route path="/hotels" element={<Hotels />} />
				<Route path="/restaurants" element={<Restaurants />} />
				<Route path="/users" element={<UsersList />} />
				<Route path="/guide_tours" element={<GuideTours />} />

				<Route path="/auth/register_user" element={<Register />} />
				<Route path="/auth/login_user" element={<Login />} />

				<Route path="/region_details/:id" element={<RegionDetails />} />
				<Route path="/tour_details/:id" element={<TourDetails />} />
				<Route path="/auth" element={<Auth />} />
				<Route path="/auth_second" element={<AuthSecond />} />
				<Route path="/add_tour" element={<AddTour />} />
			</Routes>
		</div>
	)
}

export default App
