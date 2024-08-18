/** @format */

import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook"
import { IBooking, ITour } from "@/Redux/Interfaces/tourReducerType"
import { useEffect } from "react"

export default function Bookings() {
	const { getBookings } = UseTypedDispatch()
	const bookings = useTypedSelectorHook(state => state.tours.bookings)

	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)

	const authData = localStorage.getItem("pocketbase_auth")

	const userId = JSON.parse(authData)

	console.log("userId", userId)

	const sortedTours = tours.items?.filter(
		(el: ITour) => el.guide_id === userId.userId
	)
	const sortedBookings = bookings.filter(booking =>
		sortedTours.some(tour => tour.id === booking.tour_id)
	)

	useEffect(() => {
		getTours()
		getBookings()
	}, [])

	console.log(bookings)

	console.log("sortedBookings", sortedBookings, userId.userId)

	return (
		<div>
			<h1>Bookings</h1>

			<button
				onClick={() => {
					console.log(
						"sortedTours",
						sortedTours.flatMap((el: ITour) => el.id)
					)
					console.log("sortedBookings", sortedBookings)
					console.log("bookings", bookings)
				}}
			></button>

			{sortedBookings?.map(el => (
				<div
					style={{
						background: "white",
						color: "black",
						textAlign: "center",
						width: "200px",
						height: "100px",
					}}
					className="bookingCard"
					key={el.id}
				>
					<h3>
						<span>Имя :</span> {el.username}
					</h3>
					<p>
						<span>Тел </span>
						{el.additional_text}
					</p>
					<p>
						<span>Статус: </span>
						{el.current_state}
					</p>
				</div>
			))}
		</div>
	)
}
