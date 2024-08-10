/** @format */
"use client"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import styles from "../../styles/regions_details.module.scss"
import { useParams } from "react-router-dom"

export default function RegionDetails() {
	const { getTours, getRegions } = UseTypedDispatch()
	const params = useParams()
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const [username, setUsername] = useState("")
	const [additionalText, setAdditionalText] = useState("")
	const [bookingSuccess, setBookingSuccess] = useState(null) // Track booking status

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const filteredTour = tours.items?.find(t => t?.id === params.id)

	if (!filteredTour) {
		return <p>Tour not found</p>
	}

	const handleBooking = async e => {
		e.preventDefault()

		const bookingData = {
			username,
			additional_text: additionalText,
			tour_id: filteredTour.id,
			// Assuming `tourist_id` is fetched or pre-defined elsewhere
			tourist_id: "RELATION_RECORD_ID", // Replace with actual ID
		}

		try {
			const response = await axios.post(
				"http://127.0.0.1:8090/api/collections/booking/records",
				bookingData
			)
			if (response.status === 200) {
				setBookingSuccess(true)
			}
		} catch (error) {
			console.error("Error booking the tour:", error)
			setBookingSuccess(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.tourCardsWrapper}>
				<div className={styles.tourCard}>
					<img
						className={styles.tourImage}
						src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images}`}
						alt={filteredTour.title}
					/>
					<div className={styles.tourInfo}>
						<h2 className={styles.tourTitle}>{filteredTour.title}</h2>
						<p
							className={styles.tourDescription}
							dangerouslySetInnerHTML={{ __html: filteredTour.description }}
						/>
						<div className={styles.tourMeta}>
							<h1 className={styles.tourPrice}>
								Цена за тур: {filteredTour.price} сом
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.bookingFormWrapper}>
				<h2>Book this Tour</h2>
				<form onSubmit={handleBooking} className={styles.bookingForm}>
					<label>
						Username:
						<input className='input'
							type="text"
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
						/>
					</label>
					<label>
						Additional Information:
						<textarea
							value={additionalText}
							onChange={e => setAdditionalText(e.target.value)}
						/>
					</label>
					<button type="submit">Book Now</button>
				</form>
				{bookingSuccess !== null && (
					<p>
						{bookingSuccess
							? "Booking Successful!"
							: "Booking Failed. Please try again."}
					</p>
				)}
			</div>
		</div>
	)
}
