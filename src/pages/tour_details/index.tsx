/** @format */

import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import TourImageSwipe from "../../components/swiper/swiper"
import pb from "@/lib/pocketbase"
import "../../styles/regions_details.scss"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const API_URL = "https://kyrgyz-tra.pockethost.io/api/files/tours"

const RegionDetails = () => {
	const { getTours, getRegions, getBookings } = UseTypedDispatch()
	const { id: tourId } = useParams()

	const tours = useTypedSelectorHook(state => state.tours.tours)
	const bookings = useTypedSelectorHook(state => state.tours.bookings)
	const [triggerWebsite, setTriggerWebsite] = useState(0)

	console.log(triggerWebsite)

	const [formData, setFormData] = useState({ username: "", additionalText: "" })
	const [bookingStatus, setBookingStatus] = useState<boolean | null>(null)
	const [modalOpen, setModalOpen] = useState(false)
	const [userId, setUserId] = useState(null)

	useEffect(() => {
		getRegions()
		getTours()
		getBookings()

		const authData = localStorage.getItem("pocketbase_auth")
		if (authData) {
			const { userId } = JSON.parse(authData)
			setUserId(userId)
		}
	}, [])

	const filteredTour = tours.items?.find(t => t?.id === tourId)

	if (!filteredTour) return <p>Тур не найден</p>
	console.log(bookings.some(el => el.tour_id === tourId))
	// Then in your component body:
	const isTourBooked =
		bookings?.some(el => el.tourist_id === userId && el.tour_id === tourId) ??
		false

	const handleInputChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	const handleBooking = async e => {
		e.preventDefault()

		if (!userId) {
			console.error("User ID not found. Please log in.")
			setBookingStatus(false)
			return
		}

		const bookingData = {
			...formData,
			tour_id: filteredTour.id,
			tourist_id: userId,
			current_state: "pending",
		}

		try {
			await pb.collection("booking").create(bookingData)
			setBookingStatus(true)
		} catch (error) {
			console.error("Error booking the tour:", error)
			setBookingStatus(false)
		}
	}

	const images = Array.isArray(filteredTour.images)
		? filteredTour.images
		: [filteredTour.images]

	const imagesSliced = images.slice(1, 4)

	const renderImages = () => (
		<div className="imageWrapper" onClick={() => setModalOpen(true)}>
			<img
				className="mainImage"
				src={`${API_URL}/${filteredTour.id}/${filteredTour.images[0]}?token=`}
				alt="Tour main"
				style={{
					width: images.length === 1 ? "80%" : "60%",
					height: "500px",
					objectFit: "cover",
					margin: "0 auto",
				}}
			/>
			{images.length > 1 && (
				<div className="imageBlock">
					{imagesSliced.map((image: string, index: number) => (
						<img
							key={index}
							className="image"
							src={`${API_URL}/${filteredTour.id}/${image}?token=`}
							alt={`Tour ${index + 1}`}
						/>
					))}
					<div>
						<img
							className="image"
							src={`${API_URL}/${filteredTour.id}/${filteredTour.images[4]}?token=`}
							alt="Tour additional"
						/>
						{images.length > 6 && (
							<div className="imageCount">
								<p>{`${images.length - 6}+`}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	)

	return (
		<div className="container">
			<div className="tourCardsWrapper">
				<div className="tourCard">
					<div className="tourInfo">
						{modalOpen ? (
							<TourImageSwipe
								handleModalOpenAndClose={setModalOpen}
								images={images}
								filteredTour={filteredTour}
							/>
						) : (
							renderImages()
						)}
						<h2 className="tourTitle">{filteredTour.title}</h2>
						<p
							className="tourDescription"
							dangerouslySetInnerHTML={{ __html: filteredTour.description }}
						/>
						<div className="tourMeta">
							<h1 className="tourPrice">
								Цена за тур: {filteredTour.price} сом
							</h1>
						</div>
					</div>
				</div>
			</div>
			{isTourBooked ? (
				<div>
					<h1>Тур уже забронирован</h1>
					<button
						onClick={() => console.log("isTourBooked", isTourBooked)}
					></button>
				</div>
			) : (
				<div className="bookingFormWrapper">
					<h2>Book this Tour</h2>
					<form
						onSubmit={e => {
							handleBooking(e)
							setTriggerWebsite(prev => prev + 2)
						}}
						className="bookingForm"
					>
						<label>
							Полное имя
							<input
								className="input"
								type="text"
								name="username"
								value={formData.username}
								onChange={handleInputChange}
								required
							/>
						</label>
						<label>
							номер телефона
							<input
								name="additionalText"
								value={formData.additionalText}
								onChange={handleInputChange}
							/>
						</label>
						<button type="submit">Book Now</button>
					</form>
					{bookingStatus !== null && (
						<p>
							{bookingStatus
								? "Успешное бронирование. Спасибо!"
								: "Бронирование не успешно !"}
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default RegionDetails
