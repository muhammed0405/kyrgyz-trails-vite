/** @format */
import TourCard from '@/components/tourCard'
import { user } from '@/components/userDataOnLocalStorage'
import pb from '@/lib/pocketbase'
import '@/styles/tourPage.scss'
import { useCallback, useEffect, useState } from 'react'

export default function LikedTours() {
	const [likedTours, setLikedTours] = useState([])
	const [fetchedTours, setFetchedTours] = useState([])

	const fetchTours = async () => {
		try {
			// Extract all tour_ids from likedTours
			const tourIds = likedTours.map((item) => item.tour_id)

			// Create an array of promises to fetch each tour by its tour_id
			const tourPromises = tourIds.map((tour_id) =>
				pb.collection('tours').getList(1, 50, {
					filter: `id="${tour_id}"`,
				})
			)

			// Wait for all the promises to resolve
			const results = await Promise.all(tourPromises)

			// Extract and combine all tours from the results
			const allFetchedTours = results.map((result) => result.items[0])

			// Update the fetchedTours state with the combined tours
			setFetchedTours(allFetchedTours)

			console.log('Tours fetched successfully:', allFetchedTours)
		} catch (error) {
			console.error('Error fetching tours:', error)
		}
	}

	// Automatically fetch tours when likedTours changes
	useEffect(() => {
		if (likedTours.length > 0) {
			fetchTours()
		}
	}, [likedTours])

	const fetchLikedTours = useCallback(async () => {
		if (!user?.userId) return
		try {
			const records = await pb.collection('liked_tours').getFullList({
				filter: `user_id = "${user.userId}"`,
			})
			setLikedTours(records)
		} catch (error) {
			console.error('Error fetching liked tours:', error)
		}
	}, [user?.userId])

	useEffect(() => {
		fetchLikedTours()
	}, [])

	const handleUnlike = useCallback((tourId) => {
		setLikedTours((prev) => prev.filter((tour) => tour.tour_id !== tourId))
		setFetchedTours((prev) => prev.filter((tour) => tour.id !== tourId))
	}, [])

	return (
		<div style={{ color: 'black' }}>
			<h1 style={{ textAlign: 'center' }}>Избранные туры</h1>
			<div className='tours__list' style={{ margin: '0 auto' }}>
				{fetchedTours.length > 0 ? (
					fetchedTours.map((tour) => (
						<TourCard key={tour.id} tour={tour} onUnlike={handleUnlike} />
					))
				) : (
					<h1 style={{ textAlign: 'center' }}>У вас нет избранных туров</h1>
				)}
			</div>
		</div>
	)
}
