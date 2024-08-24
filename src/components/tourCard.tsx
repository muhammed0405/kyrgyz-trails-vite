import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { user } from './userDataOnLocalStorage'

const TourCard = ({ tour }) => {
	const { addLikedTour } = UseTypedDispatch()

	const [isLiked, setIsLiked] = useState(false)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const checkIfLiked = async () => {
			setLoading(true) // Start loading
			try {
				// Ensure user ID is available
				if (user?.userId) {
					// Fetch the liked tour for the specific user and tour
					const likedTour = await pb
						.collection('liked_tours')
						.getFirstListItem(
							`user_id="${user.userId}" && tour_id="${tour.id}"`
						)

					// If the liked tour exists, set isLiked to true

					console.log('likedTour', likedTour)
					if (likedTour) {
						setIsLiked(true)
					} else {
						setIsLiked(false) // No liked tour found
					}
				} else {
					setIsLiked(false) // User ID not available
				}
			} catch (error) {
				console.error('Error fetching liked tour:', error)
				setIsLiked(false) // Default to not liked on error
			} finally {
				setLoading(false) // End loading
			}
		}

		checkIfLiked()
	}, [tour.id, user?.userId]) // Add userId to dependencies

	const handleLike = async () => {
		try {
			await addLikedTour(user?.userId, tour.id)
			setIsLiked(!isLiked)
		} catch (error) {
			console.error('Error adding liked tour:', error)
		}
	}
	if (loading) {
		return <div>Loading...</div> // Show loading state
	}

	return (
		<div className='tours__card-wrapper'>
			<span
				className={`tours__card-like ${
					isLiked ? 'tours__card-like--active' : ''
				}`}
				onClick={handleLike} // Assuming handleLike is defined elsewhere
			>
				<FaHeart />
			</span>
			<Link to={`/tour_details/${tour.id}`}>
				<div
					className='tours__card'
					style={{
						backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
							tour.id
						}/${
							Array.isArray(tour.images) ? tour.images[0] : tour.images
						}?token=)`,
						backgroundRepeat: 'no-repeat',
						backgroundPosition: 'center center',
						backgroundSize: 'cover',
					}}
				>
					<div className='tours__card-image'>
						<h3 className='tours__card-title'>{tour.title}</h3>
						<p className='tours__card-price'>Цена: {tour.price} сом</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default TourCard
