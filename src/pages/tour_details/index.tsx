/** @format */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
import '../../styles/tour_detail.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import BookTour from './book_tour'
import Comments from './comments'

export default function RegionDetails() {
	const { getTours, getRegions } = UseTypedDispatch()
	const params = useParams()

	const tours = useTypedSelectorHook((state) => state.tours.tours)

	const [modalOpen, setModalOpen] = useState(false)

	const [mainImage, setMainImage] = useState(0)

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const filteredTour = tours.items?.find((t) => t?.id === params.id)

	if (!filteredTour) {
		return <p>Тур не найден</p>
	}

	// Предполагаем, что filteredTour.images - это массив URL изображений
	const images = Array.isArray(filteredTour.images)
		? filteredTour.images
		: [filteredTour.images]

	const handleModalOpenAndClose = (e) => {
		setModalOpen(e)
	}

	return (
		<div className='container'>
			<div className='tourCard'>
				<div
					className='imageGallery'
					onClick={() => handleModalOpenAndClose(true)}
				>
					<div className='mainImageWrapper'>
						<img
							className='mainImage'
							src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images[mainImage]}?token=`}
							alt='Tour main image'
						/>
					</div>
					{images.length > 1 && (
						<div className='thumbnailStrip'>
							{images.slice(1, 5).map((image, index) => (
								<div key={index} className='thumbnailWrapper'>
									<img
										className='thumbnail'
										src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${image}?token=`}
										alt={`Tour image ${index + 2}`}
										onClick={() => setMainImage(index + 1)}
									/>
									{index === 3 && images.length > 5 && (
										<div className='imageCount'>
											<p>+{images.length - 5}</p>
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className='tourInfo'>
					<h2 className='tourTitle'>{filteredTour.title}</h2>
					<p className='tourPrice'>Цена за тур: {filteredTour.price} сом</p>
					<div
						className='tourDescription'
						dangerouslySetInnerHTML={{ __html: filteredTour.description }}
					/>
				</div>
			</div>
			<Comments tour_id={filteredTour.id} />
			<BookTour filteredTour={filteredTour} />
		</div>
	)
}
