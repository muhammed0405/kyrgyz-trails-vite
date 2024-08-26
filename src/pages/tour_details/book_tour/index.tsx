/** @format */

import { useEffect, useState } from "react"
import pb from "../../../lib/pocketbase"
import "./book_tour.scss"
import { user } from "@/components/userDataOnLocalStorage"

const BookTour = ({ filteredTour }) => {
	const [username, setUsername] = useState("")
	const [additionalText, setAdditionalText] = useState("")
	const [bookingSuccess, setBookingSuccess] = useState(null)
	const [userId, setUserId] = useState("")
	const [phoneError, setPhoneError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [existingBooking, setExistingBooking] = useState(null)

	const validatePhone = phone => {
		const phoneRegex = /^\+?[1-9]\d{1,14}$/
		return phoneRegex.test(phone)
	}

	const checkExistingBooking = async () => {
		if (!userId || !filteredTour?.id) {
			console.error("Missing userId or filteredTour.id", {
				userId,
				tourId: filteredTour?.id,
			})
			return
		}

		try {
			const filter = `tourist_id = '${userId}' && tour_id = '${filteredTour.id}'`
			const existingBookings = await pb.collection("booking").getList(1, 1, {
				filter: filter,
			})

			if (existingBookings.totalItems > 0) {
				setExistingBooking(existingBookings.items[0])
				setUsername(existingBookings.items[0].username)
				setAdditionalText(existingBookings.items[0].additional_text)
				setBookingSuccess(true)
			}
		} catch (error) {
			console.error("Error checking existing booking:", error)
		}
	}

	const handleBooking = async e => {
		e.preventDefault()
		setIsLoading(true)
		setErrorMessage("")
		setPhoneError("")

		if (!userId) {
			console.error("ID пользователя не найден")
			setErrorMessage(
				"ID пользователя не найден. Пожалуйста, войдите в аккаунт."
			)
			setBookingSuccess(false)
			setIsLoading(false)
			return
		}

		if (!validatePhone(additionalText)) {
			setPhoneError("Некорректный номер телефона")
			setIsLoading(false)
			return
		}

		try {
			if (existingBooking) {
				setErrorMessage("Вы уже забронировали этот тур")
				setBookingSuccess(false)
				setIsLoading(false)
				return
			}

			const bookingData = {
				current_state: "pending",
				username: username,
				additional_text: additionalText,
				tour_id: filteredTour.id,
				tourist_id: userId,
			}

			const record = await pb.collection("booking").create(bookingData)
			setBookingSuccess(true)
			setExistingBooking(record)
		} catch (error) {
			console.error("Ошибка бронирования:", error)
			setErrorMessage("Не удалось забронировать тур. Попробуйте заново.")
			setBookingSuccess(false)
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		// Simulating user authentication
		setUserId(user?.userId)
	}, [])

	useEffect(() => {
		if (userId && filteredTour?.id) {
			if (filteredTour.guide_id === userId) {
				setErrorMessage("guide")
			} else {
				checkExistingBooking()
			}
		}
	}, [userId, filteredTour])

	return (
		<div className={"bookingFormWrapper"}>
			<h2>Бронирование</h2>
			{errorMessage === "guide" ? (
				<h3 className="error">Вы не можете бронировать свой тур</h3>
			) : existingBooking ? (
				<div className="existingBooking">
					<h3>Вы бронировали этот тур</h3>
					<p>
						Имя: <span>{existingBooking.username}</span>
					</p>
					<p>
						Номер Телефона: <span>{existingBooking.additional_text}</span>
					</p>
					<p>
						Статус:{" "}
						<span>
							{existingBooking.current_state === "pending"
								? "В ожидании"
								: errorMessage.current_state === "confirmed"
								? "Подтверждено"
								: "Отклонено"}
						</span>
					</p>
					<p>
						Время бронирования: <span>{existingBooking.created}</span>
					</p>
				</div>
			) : !userId ? (
				<div>
					<h3 className="error">Вы не авторизованы</h3>
					<p>Войдите или зарегистрируйтесь, чтобы бронировать тур</p>
				</div>
			) : (
				<form onSubmit={handleBooking} className={"bookingForm"}>
					<label>
						Полное имя
						<input
							className="input"
							type="text"
							value={username}
							onChange={e => setUsername(e.target.value)}
							required
						/>
					</label>
					<label>
						Номер телефона
						<input
							value={additionalText}
							onChange={e => setAdditionalText(e.target.value)}
							required
						/>
						{phoneError && <span className="error">{phoneError}</span>}
					</label>
					<button type="submit" disabled={isLoading}>
						{isLoading ? "Обрабатывается..." : "Забронировать"}
					</button>
				</form>
			)}
			{errorMessage === "guide"
				? null
				: errorMessage && <p className="error">{errorMessage}</p>}
			{bookingSuccess !== null && !existingBooking && (
				<p className={bookingSuccess ? "success" : "error"}>
					{bookingSuccess
						? "Успешное бронирование. Спасибо!"
						: "Бронирование не успешно !"}
				</p>
			)}
		</div>
	)
}

export default BookTour
