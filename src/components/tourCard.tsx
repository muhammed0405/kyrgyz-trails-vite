/** @format */

import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { user } from './userDataOnLocalStorage'

const TourCard = ({ tour }) => {
	const { addLikedTour } = UseTypedDispatch()
	const [isLiked, setIsLiked] = useState(false)

	useEffect(() => {
		const checkIfLiked = async () => {
			try {
				const userData = await pb.collection('users').getOne(user?.userId)
				setIsLiked(userData.likedTours.includes(tour.id))
				console.log('isLiked', userData.likedTours.includes(tour.id))
			} catch (error) {
				console.error('Error fetching user data:', error)
			}
		}

		checkIfLiked()
	}, [tour.id]) // Add tour.id as a dependency

	const handleLike = async (tourId) => {
		try {
			await addLikedTour(user?.userId, tourId)
			setIsLiked(!isLiked)
		} catch (error) {
			console.error('Error adding liked tour:', error)
		}
	}

	return (
		// <Link to={`/tour_details/${tour.id}`}>
		<div
			className={tourPagetourCard}
			style={{
				backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${tour.id}/${tour.images[0]})`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center center',
				backgroundSize: 'cover',
			}}
			onClick={() => handleLike(el.id)}
		>
			<span
				style={{ color: isLiked ? 'blue' : 'white' }}
				className={tourPagelikeIcon}
			>
				<FaHeart />
			</span>
			<h3>{tour.title}</h3>
			<p className={tourPageprice}>Цена: {tour.price} сом</p>
		</div>
		// </Link>
	)
}

export default TourCard
