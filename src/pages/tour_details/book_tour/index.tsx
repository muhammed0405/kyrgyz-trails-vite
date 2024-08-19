/** @format */

import { useEffect, useState } from 'react'
import pb from '../../../lib/pocketbase'
import './book_tour.scss'

const BookTour = ({ filteredTour }) => {
	const [username, setUsername] = useState('')
	const [additionalText, setAdditionalText] = useState('')
	const [bookingSuccess, setBookingSuccess] = useState(null)
	const [userId, setUserId] = useState(null)
	const [phoneError, setPhoneError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [existingBooking, setExistingBooking] = useState(null)

	const validatePhone = (phone) => {
		const phoneRegex = /^\+?[1-9]\d{1,14}$/
		return phoneRegex.test(phone)
	}

	const checkExistingBooking = async () => {
		if (!userId || !filteredTour?.id) {
			console.error('Missing userId or filteredTour.id', {
				userId,
				tourId: filteredTour?.id,
			})
			return
		}

		try {
			const filter = `tourist_id = '${userId}' && tour_id = '${filteredTour.id}'`
			const existingBookings = await pb.collection('booking').getList(1, 1, {
				filter: filter,
			})

			if (existingBookings.totalItems > 0) {
				setExistingBooking(existingBookings.items[0])
				setUsername(existingBookings.items[0].username)
				setAdditionalText(existingBookings.items[0].additional_text)
				setBookingSuccess(true)
			}
		} catch (error) {
			console.error('Error checking existing booking:', error)
		}
	}

	const handleBooking = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setErrorMessage('')
		setPhoneError('')

		if (!userId) {
			console.error('User ID not found. Please log in.')
			setErrorMessage('User ID not found. Please log in.')
			setBookingSuccess(false)
			setIsLoading(false)
			return
		}

		if (!validatePhone(additionalText)) {
			setPhoneError('Please enter a valid phone number')
			setIsLoading(false)
			return
		}

		try {
			if (existingBooking) {
				setErrorMessage('You have already booked this tour.')
				setBookingSuccess(false)
				setIsLoading(false)
				return
			}

			const bookingData = {
				current_state: 'pending',
				username: username,
				additional_text: additionalText,
				tour_id: filteredTour.id,
				tourist_id: userId,
			}

			const record = await pb.collection('booking').create(bookingData)
			setBookingSuccess(true)
			setExistingBooking(record)
		} catch (error) {
			console.error('Error booking the tour:', error)
			setErrorMessage('An error occurred while booking. Please try again.')
			setBookingSuccess(false)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		// Simulating user authentication
		setUserId(JSON.parse(localStorage.getItem('pocketbase_auth'))?.userId)
	}, [])

	useEffect(() => {
		if (userId && filteredTour?.id) {
			if (filteredTour.guide_id === userId) {
				setErrorMessage('guide')
			} else {
				checkExistingBooking()
			}
		}
	}, [userId, filteredTour])

	return (
		<div className={'bookingFormWrapper'}>
			<h2>Бронирование</h2>
			{errorMessage === 'guide' ? (
				<h3 className='error'>Вы не можете бронировать свой тур</h3>
			) : existingBooking ? (
				<div className='existingBooking'>
					<h3>Вы бронировали этот тур</h3>
					<p>
						Имя: <span>{existingBooking.username}</span>
					</p>
					<p>
						Номер Телефона: <span>{existingBooking.additional_text}</span>
					</p>
					<p>
						Статус: <span>{existingBooking.current_state}</span>
					</p>
					<p>
						Время бронирования: <span>{existingBooking.created}</span>
					</p>
				</div>
			) : !userId ? (
				<div>
					<h3 className='error'>Вы не авторизованы</h3>
					<p>Войдите или зарегистрируйтесь, чтобы бронировать тур</p>
				</div>
			) : (
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
							required
						/>
						{phoneError && <span className='error'>{phoneError}</span>}
					</label>
					<button type='submit' disabled={isLoading}>
						{isLoading ? 'Booking...' : 'Book Now'}
					</button>
				</form>
			)}
			{errorMessage === 'guide'
				? null
				: errorMessage && <p className='error'>{errorMessage}</p>}
			{bookingSuccess !== null && !existingBooking && (
				<p className={bookingSuccess ? 'success' : 'error'}>
					{bookingSuccess
						? 'Успешное бронирование. Спасибо!'
						: 'Бронирование не успешно !'}
				</p>
			)}
		</div>
	)
}

export default BookTour
