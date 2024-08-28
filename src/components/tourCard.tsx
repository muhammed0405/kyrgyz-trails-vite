import pb from '@/lib/pocketbase'
import '@/styles/tourPage.scss'
import { useCallback, useEffect, useState } from 'react'
import { BsFillPersonFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { GiPriceTag } from 'react-icons/gi'
import { IoStar } from 'react-icons/io5'
import { TfiComment } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import { showErrorToast } from './common/toaster/customToast'
import { user } from './userDataOnLocalStorage'

// Кэш объектисин түзөбүз
const cache = {
	users: {},
	likes: {},
	comments: {},
}

const TourCard = ({ tour, onUnlike }) => {
	const [isLiked, setIsLiked] = useState(false)
	const [comments, setComments] = useState([])
	const [guideUser, setGuideUser] = useState(null)

	const fetchData = useCallback(async () => {
		if (!user?.userId || !tour.id || !tour.guide_id) return

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
			console.error('Error fetching data:', error)
			if (error.status === 429) {
				showErrorToast(
					'Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.'
				)
			} else {
				showErrorToast(`Не удалось загрузить данные: ${error.message}`)
			}
		}
	}, [tour.id, tour.guide_id, user?.userId])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const toggleLike = async () => {
		if (!user?.userId) {
			return showErrorToast('You need to log in to like a tour')
		}

		setIsLiked((prevIsLiked) => !prevIsLiked)
		try {
			if (isLiked) {
				const record = await pb
					.collection('liked_tours')
					.getFirstListItem(
						`user_id = "${user.userId}" && tour_id = "${tour.id}"`
					)
				await pb.collection('liked_tours').delete(record?.id)
				cache.likes[tour.id] = false
				setIsLiked(false)
				onUnlike && onUnlike(tour.id)
			} else {
				await pb.collection('liked_tours').create({
					user_id: user.userId,
					tour_id: tour.id,
				})
				cache.likes[tour.id] = true
				setIsLiked(true)
			}
		} catch (error) {
			console.error('Error toggling like:', error)
			showErrorToast('Error toggling like status')
		}
	}

	return (
		<div className='regions_block' key={tour.id}>
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
					<p className=''>
						<span>
							<GiPriceTag />
						</span>{' '}
						: {tour.price} сом
					</p>
					<p>
						<BsFillPersonFill style={{ color: '#2575FC', fontSize: '20px' }} />{' '}
						: {guideUser?.username || 'Загрузка...'}
					</p>
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
