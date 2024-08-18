/** @format */
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import "../../styles/regions_details.scss"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import TourImageSwipe from "../../components/swiper/swiper"
import BookTour from "./book_tour"
import Comments from "./comments"

export default function RegionDetails() {
	const { getTours, getRegions } = UseTypedDispatch()
	const params = useParams()

	const tours = useTypedSelectorHook(state => state.tours.tours)

	const [modalOpen, setModalOpen] = useState(false)

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const filteredTour = tours.items?.find(t => t?.id === params.id)

	if (!filteredTour) {
		return <p>Тур не найден</p>
	}

	// Предполагаем, что filteredTour.images - это массив URL изображений
	const images = Array.isArray(filteredTour.images)
		? filteredTour.images
		: [filteredTour.images]

	const handleModalOpenAndClose = e => {
		setModalOpen(e)
	}

	const imagesSliced = images.slice(1, 4)

	return (
		<div className={"container"}>
			<div className={"tourCardsWrapper"}>
				<div className={"tourCard"}>
					<div className="tourInfo">
						{modalOpen ? (
							<TourImageSwipe
								handleModalOpenAndClose={handleModalOpenAndClose}
								images={images}
								filteredTour={filteredTour}
							/>
						) : (
							<div
								className="imageWrapper"
								onClick={() => handleModalOpenAndClose(true)}
							>
								<img
									className={"mainImage"}
									src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images[0]}?token=`}
									alt={"it is a tour"}
									style={{
										width: images.length === 1 ? "80%" : "60%",
										height: images.length === 1 ? "500px" : "500px",
										objectFit: "cover",
										margin: "0 auto",
									}}
								/>
								{images.length > 1 ? (
									<div className="imageBlock">
										{imagesSliced.map((image, index) => (
											<img
												className={"image"}
												src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${image}?token=`}
												alt={"it is a tour"}
											/>
										))}
										<div>
											<img
												className={"image"}
												src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${filteredTour.images[4]}?token=`}
												alt={"it is a tour"}
											/>
											{images.length > 6 ? (
												<div className={"imageCount"}>
													<p>{images.length - 6 + "+"}</p>
												</div>
											) : null}
										</div>
									</div>
								) : null}
							</div>
						)}

						<h2 className={"tourTitle"}>{filteredTour.title}</h2>
						<p
							className={"tourDescription"}
							dangerouslySetInnerHTML={{ __html: filteredTour.description }}
						/>
						<div className={"tourMeta"}>
							<h1 className={"tourPrice"}>
								Цена за тур: {filteredTour.price} сом
							</h1>
						</div>
					</div>
				</div>
			</div>
			{}
			<Comments tour_id={filteredTour.id} />
			<BookTour filteredTour={filteredTour} />
		</div>
	)
}
