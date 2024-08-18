/** @format */

import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook"
import { ITour } from "@/Redux/Interfaces/tourReducerType"
import { useEffect } from "react"
import "./bookings.scss"

export default function Bookings() {
	const { getBookings, updateBooking } = UseTypedDispatch()
	const bookings = useTypedSelectorHook(state => state.tours.bookings)

	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)

	const authData = localStorage.getItem("pocketbase_auth")
	const userId = JSON.parse(authData)

	const sortedTours = tours.items?.filter(
		(el: ITour) => el.guide_id === userId.userId
	)
	const sortedBookings = bookings.filter(booking =>
		sortedTours?.some(tour => tour.id === booking.tour_id)
	)

	useEffect(() => {
		getTours()
		getBookings()
	}, [])

	const changeBookingStatus = async (bookingId: string, newStatus: string) => {
		try {
			await updateBooking({ id: bookingId, current_state: newStatus })

			getBookings()
		} catch (error) {
			console.error("Error updating booking status:", error)
		}
	}

	return (
		<div className="retro-container">
			<h1 className="retro-header">Bookings</h1>

			{sortedBookings?.map(el => (
				<div className="retro-booking-card" key={el.id}>
					<h3>Имя: {el.username}</h3>
					<p>Номер телефона: {el.additional_text}</p>
					<p>статус: {el.current_state}</p>
					<div className="button-group">
						<button
							className="retro-button"
							onClick={() => changeBookingStatus(el.id, "confirmed")}
						>
							Подтвердить
						</button>
						<button
							className="retro-button"
							onClick={() => changeBookingStatus(el.id, "cancelled")}
						>
							Отменить
						</button>
						<button
							className="retro-button"
							onClick={() => changeBookingStatus(el.id, "completed")}
						>
							Завершить
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
