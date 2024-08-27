/** @format */

import TourCard from "@/components/tourCard"
import { user } from "@/components/userDataOnLocalStorage"
import pb from "@/lib/pocketbase"
import { useEffect, useState } from "react"
import "@/styles/tourPage.scss"

export default function LikedTours() {
	const [fetchedTours, setFetchedTours] = useState([])

	// Fetch liked tours and their details
	const fetchLikedTours = async () => {
		try {
			const response = await pb.collection("liked_tours").getFullList({
				expand: "tour",
				filter: `user_id = "${user?.userId}"`,
			})

			const likedToursWithDetails = response.map(
				likedTour => likedTour.expand.tour
			)
			setFetchedTours(likedToursWithDetails)
		} catch (error) {
			console.error("Error fetching liked tours:", error)
		}
	}

	// Handle unliking of tours
	const handleUnlike = tourId => {
		setFetchedTours(prevFetchedTours =>
			prevFetchedTours.filter(tour => tour.id !== tourId)
		)
	}

	// Fetch liked tours on component mount
	useEffect(() => {
		fetchLikedTours()
	}, [])

	return (
		<div>
			<h1 style={{ color: "red" }}>Liked Tours</h1>
			<div className="tours__list" style={{ margin: "0 auto" }}>
				{fetchedTours?.map(tour => (
					<TourCard
						key={tour.id}
						tour={tour}
						onUnlike={handleUnlike} // Pass the onUnlike handler to each TourCard
					/>
				))}
			</div>
		</div>
	)
}
