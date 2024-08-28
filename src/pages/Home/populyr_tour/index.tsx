import pb from '@/lib/pocketbase'
import { useEffect, useState } from 'react'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

const PopularTours = () => {
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const { getTours } = UseTypedDispatch()
	const [allComments, setAllComments] = useState([])
	const [popularTours, setPopularTours] = useState([])

	useEffect(() => {
		getTours()
		fetchComments()
	}, [])

	const fetchComments = async () => {
		try {
			const comments = await pb.collection('comments').getFullList()
			setAllComments(comments)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (tours.items && allComments.length > 0) {
			const tourRatings = allComments.reduce((acc, comment) => {
				if (!acc[comment.tour]) {
					acc[comment.tour] = { totalStars: 0, count: 0 }
				}
				acc[comment.tour].totalStars += comment.star
				acc[comment.tour].count += 1
				return acc
			}, {})

			const toursWithRatings = tours.items.map((tour) => ({
				...tour,
				avgRating: tourRatings[tour.id]
					? tourRatings[tour.id].totalStars / tourRatings[tour.id].count
					: 0,
				commentCount: tourRatings[tour.id] ? tourRatings[tour.id].count : 0,
			}))

			const sortedTours = toursWithRatings
				.sort(
					(a, b) => b.avgRating - a.avgRating || b.commentCount - a.commentCount
				)
				.slice(0, 5) // Top 5 popular tours

			setPopularTours(sortedTours)
		}
	}, [tours.items, allComments])

	return (
		<div className='popular-tours'>
			<h2 className='popular-tours__title'>Эң популярдуу турлар</h2>
			<div className='popular-tours__list'>
				{popularTours.map((tour) => (
					<div key={tour.id} className='popular-tours__item'>
						<h3>{tour.title}</h3>
						<p>Орточо баа: {tour.avgRating.toFixed(2)}</p>
						<p>Комментарийлер: {tour.commentCount}</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default PopularTours
