/** @format */

import { 
	showErrorToast, 
	showSuccessToast, 
} from '@/components/common/toaster/customToast'
import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '@/Redux/customHooks/useTypedSelectorHook'
import { useEffect } from 'react'
import { FaTrash, FaTimes } from 'react-icons/fa'
import styles from "../../styles/bookingsTourist.module.scss"
import { Link } from 'react-router-dom'
export default function BookingsTourist() {
	const dispatch = UseTypedDispatch()
	const { getBookings, updateBooking, getTours } = dispatch
	const bookings = useTypedSelectorHook((state) => state.tours.bookings)
	const tours = useTypedSelectorHook((state) => state.tours.tours)

	const authData = localStorage.getItem('pocketbase_auth')
	const userId = JSON.parse(authData)
	const sortedBookings = bookings.filter(
			(booking) => booking.tourist_id === userId.userId
	)

	const deleteBooking = async (bookingId: string) => {
			try {
					await pb.collection('booking').delete(bookingId)
					showSuccessToast('Бронь успешно удалена')
					getBookings()
			} catch (error) {
					console.error('Error deleting booking:', error)
					showErrorToast('Произошла ошибка при удалении брони')
			}
	}

	useEffect(() => {
			getBookings()
			getTours()
	}, [])

	const getTourInfo = (tourId) => {
			return tours.items?.find(tour => tour.id === tourId) || null
	}

	const getStatusClass = (status) => {
			switch(status) {
					case 'pending': return styles.pendingStatus;
					case 'confirmed': return styles.confirmedStatus;
					case 'canceled': return styles.canceledStatus;
					default: return '';
			}
	}

	return (
			<div className={styles.bookingsContainer}>
					<h1 className={styles.title}>Мои брони</h1>
					{sortedBookings?.map((el) => {
							const tourInfo = getTourInfo(el.tour_id)
							return (
									<div key={el.id} className={styles.bookingCard}>
											{tourInfo && (
													<>
															<h2 className={styles.tourTitle}>{tourInfo.title}</h2>
															{tourInfo.images && tourInfo.images[0] && (
																			<Link to={`/tour_details/${tourInfo.id}`}>
																			
																			<img 
																			src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${tourInfo.id}/${tourInfo.images[0]}`}
																			
																			alt={tourInfo.title}
																			className={styles.tourImage}
																	/>
																			
																			</Link>
														
														
															)}
													</>
											)}
											<p className={`${styles.statusText} ${getStatusClass(el.current_state)}`}>
													Статус: {
															el.current_state === "pending" ? "Ожидает подтверждения" : 
															el.current_state === "confirmed" ? "Подтверждено" : 
															"Отменено"
													}
											</p>
											<div className={styles.buttonGroup}>
													<button onClick={() => deleteBooking(el.id)} className={`${styles.button} ${styles.deleteButton}`}>
															<FaTrash /> Удалить
													</button>
													<button onClick={() => updateBooking({ id: el.id, current_state: 'canceled' })} className={`${styles.button} ${styles.cancelButton}`}>
															<FaTimes /> Отменить
													</button>
											</div>
									</div>
							)
					})}
			</div>
	)
}