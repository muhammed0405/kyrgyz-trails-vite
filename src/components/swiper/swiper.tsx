import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
const TourImageSwipe = ({ images, filteredTour, handleModalOpenAndClose }) => {
	return (
		<div className={'tourImageSwipe'}>
			<div className={'tourImageSwipeShadow'}></div>
			<Swiper
				onClick={() => handleModalOpenAndClose(false)}
				modules={[Navigation, Pagination]}
				spaceBetween={50}
				slidesPerView={1}
				navigation
				pagination={{
					clickable: true,
					bulletClass: 'swiper-pagination-bullet',
					bulletActiveClass: 'swiper-pagination-bullet-active',
				}}
				style={{ padding: '20px' }}
			>
				{images.map((image, index) => (
					<SwiperSlide
						key={index}
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							height: '400px',
						}}
					>
						<img
							className={'tourImage'}
							src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${filteredTour.id}/${image}`}
							alt={`${filteredTour.title} - Image ${index + 1}`}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default TourImageSwipe
