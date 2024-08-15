import { useEffect, useState } from 'react'
import pb from '../../../lib/pocketbase'
const BookTour = ({ filteredTour }) => {
	const [username, setUsername] = useState('')
	const [additionalText, setAdditionalText] = useState('')
	const [bookingSuccess, setBookingSuccess] = useState(false)
	const [userId, setUserId] = useState(null)

	const handleBooking = async (e) => {
		e.preventDefault()

		if (!userId) {
			console.error('User ID not found. Please log in.')
			setBookingSuccess(false)
			return
		}

		const bookingData = {
			current_state: 'pending',
			username: username,
			additional_text: additionalText,
			tour_id: filteredTour.id,
			tourist_id: userId, // Добавляем начальное состояние бронирования
		}

		try {
			const record = await pb.collection('booking').create(bookingData)
			setBookingSuccess(true)
		} catch (error) {
			console.error('Error booking the tour:', error)
			setBookingSuccess(false)
		}
	}

	useEffect(() => {
		const authData = localStorage.getItem('pocketbase_auth')

		if (authData) {
			const parsedData = JSON.parse(authData)
			console.log('parsedData' + parsedData)
			setUserId(parsedData.userId)
		}
	})
	return (
		<div className={'bookingFormWrapper'}>
			<h2>Book this Tour</h2>
			<form onSubmit={handleBooking} className={'bookingForm'}>
				<label>
					Полное имя
					<input
						className='input'
						type='text'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				<label>
					номер телефона
					<input
						value={additionalText}
						onChange={(e) => setAdditionalText(e.target.value)}
					/>
				</label>
				<button type='submit'>Book Now</button>
			</form>
			{bookingSuccess !== null && (
				<p>
					{bookingSuccess
						? 'Успешное бронирование. Спасибо!'
						: 'Бронирование не успешно !'}
				</p>
			)}
		</div>
	)
}

export default BookTour
