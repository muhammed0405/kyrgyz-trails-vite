/** @format */
'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
import '../../styles/regions_details.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import TourImageSwipe from '../../components/swiper/swiper'

export default function RegionDetails() {
	const { getTours, getRegions } = UseTypedDispatch()
	const params = useParams()
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const [username, setUsername] = useState('')
	const [additionalText, setAdditionalText] = useState('')
	const [bookingSuccess, setBookingSuccess] = useState(null)
	const [modalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const filteredTour = tours.items?.find((t) => t?.id === params.id)

	if (!filteredTour) {
		return <p>Tour not found</p>
	}

	const handleBooking = async (e) => {
		e.preventDefault()

		const bookingData = {
			username,
			additional_text: additionalText,
			tour_id: filteredTour.id,
			tourist_id: 'RELATION_RECORD_ID',
		}

		try {
			const response = await axios.post(
				'http://127.0.0.1:8090/api/collections/booking/records',
				bookingData
			)
			if (response.status === 200) {
				setBookingSuccess(true)
			}
		} catch (error) {
			console.error('Error booking the tour:', error)
			setBookingSuccess(false)
		}
	}

	// Предполагаем, что filteredTour.images - это массив URL изображений
	const images = Array.isArray(filteredTour.images)
		? filteredTour.images
		: [filteredTour.images]

	const handleModalOpenAndClose = (e) => {
		setModalOpen(e)
	}

	const imagesSliced = images.slice(1, 4)

	console.log(imagesSliced)

	return (
		<div className={'container'}>
			<div className={'tourCardsWrapper'}>
				<div className={'tourCard'}>
					<div className='tourInfo'>
						{modalOpen ? (
							<TourImageSwipe
								handleModalOpenAndClose={handleModalOpenAndClose}
								images={images}
								filteredTour={filteredTour}
							/>
						) : (
							<div
								className='imageWrapper'
								onClick={() => handleModalOpenAndClose(true)}
							>
								<img
									className={'mainImage'}
									src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images[0]}?token=`}
									alt={'it is a tour'}
									style={{
										width: images.length === 1 ? '80%' : '60%',
										height: images.length === 1 ? '500px' : '500px',
										objectFit: 'cover',
										margin: '0 auto',
									}}
								/>
								{images.length > 1 ? (
									<div className='imageBlock'>
										{imagesSliced.map((image, index) => (
											<img
												className={'image'}
												src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${image}?token=`}
												alt={'it is a tour'}
											/>
										))}
										<div>
											<img
												className={'image'}
												src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images[4]}?token=`}
												alt={'it is a tour'}
											/>
											{images.length > 6 ? (
												<div className={'imageCount'}>
													<p>{images.length - 6 + '+'}</p>
												</div>
											) : null}
										</div>
									</div>
								) : null}
							</div>
						)}

						<h2 className={'tourTitle'}>{filteredTour.title}</h2>
						<p
							className={'tourDescription'}
							dangerouslySetInnerHTML={{ __html: filteredTour.description }}
						/>
						<div className={'tourMeta'}>
							<h1 className={'tourPrice'}>
								Цена за тур: {filteredTour.price} сом
							</h1>
						</div>
					</div>
				</div>
			</div>
			<div className={'bookingFormWrapper'}>
				<h2>Book this Tour</h2>
				<form onSubmit={handleBooking} className={'bookingForm'}>
					<label>
						Username:
						<input
							className='input'
							type='text'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
						/>
					</label>
					<label>
						Additional Information:
						<textarea
							value={additionalText}
							onChange={(e) => setAdditionalText(e.target.value)}
						/>
					</label>
					<button type='submit'>Book Now</button>
				</form>
				{bookingSuccess !== null && (
					<p>
						{bookingSuccess
							? 'Booking Successful!'
							: 'Booking Failed. Please try again.'}
					</p>
				)}
			</div>
		</div>
	)
}
