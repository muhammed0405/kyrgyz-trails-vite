/** @format */
import pb from '@/lib/pocketbase'
import '@/styles/tourPage.scss'
import { useCallback, useEffect, useState } from 'react'
import { FaHeart } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { showErrorToast } from './common/toaster/customToast'
import { user } from './userDataOnLocalStorage'

const TourCard = ({ tour, onUnlike }) => {
	const [isLiked, setIsLiked] = useState(false)

	const fetchLikedStatus = useCallback(async () => {
		if (!user?.userId) return
		try {
			// Гиддин маалыматын алуу
			if (!cache.users[tour.guide_id]) {
				const userRecord = await pb.collection('users').getOne(tour.guide_id)
				cache.users[tour.guide_id] = userRecord
			}
			setGuideUser(cache.users[tour.guide_id])

			// Лайктарды текшерүү
			if (!cache.likes[tour.id]) {
				const likedRecord = await pb
					.collection('liked_tours')
					.getFirstListItem(
						`user_id = "${user.userId}" && tour_id = "${tour.id}"`
					)
					.catch(() => null)
				cache.likes[tour.id] = !!likedRecord
			}
			setIsLiked(cache.likes[tour.id])

			// Комментарийлерди алуу
			if (!cache.comments[tour.id]) {
				const commentsRecord = await pb.collection('comments').getList(1, 5, {
					filter: `tour = "${tour.id}"`,
				})
				cache.comments[tour.id] = commentsRecord.items
			}
			setComments(cache.comments[tour.id])
		} catch (error) {
			if (error.status !== 404) {
				console.error('Error fetching liked status:', error)
			}
		}
	}, [tour.id, user?.userId])

	useEffect(() => {
		fetchLikedStatus()
	}, [fetchLikedStatus])

	const toggleLike = async () => {
		if (!user?.userId) {
			return showErrorToast('You need to log in to like a tour')
		}

		setIsLiked(!isLiked)
		try {
			if (isLiked) {
				const record = await pb
					.collection('liked_tours')
					.getFirstListItem(
						`user_id = "${user.userId}" && tour_id = "${tour.id}"`
					)

				await pb.collection('liked_tours').delete(record?.id)
				setIsLiked(false)
				onUnlike && onUnlike(tour.id)
			} else {
				await pb.collection('liked_tours').create({
					user_id: user.userId,
					tour_id: tour.id,
				})
				setIsLiked(true)
				console.log(
					`Tour ${tour.id} added to liked tours for user ${user.userId}`
				)
			}
		} catch (error) {
			console.error('Error toggling like:', error)
			showErrorToast('Error toggling like status')
		}
	}

	return (
		<div className='regions_block' key={tour.id} >
			<Link to={`/tour_details/${tour.id}`} className='region-link'>
				<img
					src={`https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
						tour.id
					}/${
						Array.isArray(tour.images) ? tour.images[0] : tour.images
					}?token=`}
					alt={tour.title}
					className='regions_block__card'
				/>
			</Link>
			<div className='regions_block__content'>
				<div>
					<h3 className=''>{tour.title}</h3>
					<p className=''>Цена: {tour.price} сом</p>
				</div>

				<div className='like_block'>
					<span
						onClick={toggleLike}
						style={{
							color: isLiked ? 'red' : '#2575FC',
							cursor: 'pointer',
							fontSize: '25px',
						}}
					>
						<FaHeart />
					</span>
					<Link className='commentsLink' to={`/comments/${tour.id}`}>
						<TfiComment /> : <p> {comments.length}</p>
					</Link>
					<p className='comment__stars'>
						<IoStar /> :{' '}
						{(
							comments.reduce((a, b) => a + b.star, 0) / comments.length
						).toFixed(1) === 'NaN'
							? '0'
							: (
									comments.reduce((a, b) => a + b.star, 0) / comments.length
							  ).toFixed(1)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default TourCard
