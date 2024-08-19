import PocketBase from 'pocketbase'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import CustomToast, {
	showErrorToast,
	showSuccessToast,
} from '@/components/common/toaster/customToast'
const pb = new PocketBase('https://kyrgyz-tra.pockethost.io')
export default function DeleteTour() {
	const [tours, setTours] = useState([])
	const [error, setError] = useState('')

	useEffect(() => {
		fetchTours()
	}, [])

	const fetchTours = async () => {
		try {
			const records = await pb.collection('tours').getFullList({
				sort: '-created',
			})
			setTours(records)
			setError('')
		} catch (err) {
			console.error('Ошибка при получении туров:', err)
		}
	}
	const handleErrorClick = () => {
		showErrorToast('Ошибка при удалении тура')
	}

	const handleSuccessClick = () => {
		showSuccessToast('Тур удачно удалено')
	}

	const handleDelete = async (tourId) => {
		try {
			await pb.collection('tours').delete(tourId)
			setTours(tours.filter((tour) => tour.id !== tourId))
			console.log('Тур ийгиликтүү өчүрүлдү')
			handleSuccessClick()
		} catch (err) {
			console.error('Турду өчүрүүдө ката кетти:', err)
			setError('Ошибка')
			handleErrorClick()
		}
	}

	return (
		<div>
			<h1>удаление туров</h1>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<ol style={{ listStylePosition: 'inside', padding: 0 }}>
				{tours.map((tour) => (
					<li
						key={tour.id}
						style={{
							color: 'black',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							maxWidth: '500px',
							width: '100%',
							margin: '10px',
						}}
					>
						<span
							style={{
								marginRight: '10px',
								display: 'flex',
								alignItems: 'center',
								gap: '10px',
							}}
						>
							<p>{tours.indexOf(tour) + 1}.</p>
							<Link to={`/tour_details/${tour.id}`}>
								{tour.title} - {tour.location}-{tour.price}
							</Link>
						</span>
						<button
							style={{
								backgroundColor: 'none',
								border: '2px solid orange',
								padding: '10px',
								borderRadius: '5px',
							}}
							onClick={() => handleDelete(tour.id)}
						>
							Удалить
						</button>
					</li>
				))}
			</ol>
            <CustomToast />
		</div>
	)
}
