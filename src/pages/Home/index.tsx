/** @format */
'use client'
import '@/styles/page.scss'
import { useEffect, useState } from 'react'

import Search from '@/components/search/search'
import TourCard from '@/components/tourCard'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

export default function Home() {
	const regions = useTypedSelectorHook((state) => state.tours.regions)
	const tours = useTypedSelectorHook((state) => state.tours.tours)

	const { getRegions, getTours } = UseTypedDispatch()
	const { items = [] } = regions // Default to an empty array if items is undefined
	const [imageIndex, setImageIndex] = useState(0)

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			const nextIndex = (imageIndex + 1) % items.length
			const nextImageUrl = `https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${items[nextIndex]?.id}/${items[nextIndex]?.image}?token=`

			setImageIndex(nextIndex)
			setShowText(false) // текстти жашырабыз
			setNextImage(nextImageUrl)
			// Сүрөт алмашкандан кийин текстти көрсөтөбүз
			setTimeout(() => {
				setImageIndex(nextIndex)
				setCurrentImage(nextImageUrl)
				setIsTransitioning(false)
				setShowText(true)
			}, 1000) // 1 секунд анимация үчүн
		}, 5000)

		return () => clearInterval(interval)
	}, [imageIndex, items])

	const slicedTours = tours.items?.slice(0, 4)
	console.log('items', items.id)

	const selectedImage = items[imageIndex]

	const backgroundImage = `https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${selectedImage?.id}/${selectedImage?.image}?token=`

	const [currentImage, setCurrentImage] = useState(backgroundImage)
	const [nextImage, setNextImage] = useState('')
	const [isTransitioning, setIsTransitioning] = useState(false)

	const [showText, setShowText] = useState(true)

	return (
		<div className={'homePage'}>
			<section style={{ position: 'relative' }} className={'hero'}>
				<div
					style={{
						position: 'absolute',
						zIndex: 0,
						width: '100%',
						maxWidth: '1520px',
						height: '500px',
						opacity: isTransitioning ? 0 : 0.7,
						background: 'black',
						transition: 'opacity 1s ease',
					}}
				>
					<img
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
						src={currentImage}
						alt='Current image'
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						zIndex: 0,
						width: '100%',
						maxWidth: '1520px',
						height: '500px',
						opacity: isTransitioning ? 0.7 : 0,
						background: 'black',
						transition: 'opacity 1s ease',
					}}
				>
					<img
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
						src={nextImage}
						alt='Next image'
					/>
				</div>
				<div
					style={{
						position: 'absolute',
						zIndex: 1,
						width: '100%',
						maxWidth: '1520px',
						height: '500px',
						opacity: '0.4',
						background: 'black',
					}}
				></div>
				<div className={`heroText ${showText ? 'show' : ''}`}>
					<h1>
						Кыргызстандын укмуштуудай керемет дүйнөсүн өзүңүз үчүн ачыңыз!!!
					</h1>
					<p>
						Саякатыңызды пландаштырыңыз, керемет жерлерге барыңыз, жана
						унутулгус элестерди түбөлүккө сактаңыз
					</p>
				
				</div>
				<button
					style={{
						zIndex: 1,
						position: 'absolute',
						left: '10px',
						top: '220px',
						padding: '10px',
						border: 'none',
						cursor: 'pointer',
						background: 'transparent',
						color: '#fff',
						fontSize: '50px',
						fontWeight: 700,
					}}
					onClick={() => setImageIndex(imageIndex > 0 ? imageIndex - 1 : 7)}
				>
					<IoIosArrowBack />
				</button>
				<button
					style={{
						zIndex: 1,
						position: 'absolute',
						right: '10px',
						top: '220px',
						padding: '10px',
						border: 'none',
						cursor: 'pointer',
						background: 'transparent',
						color: '#fff',
						fontSize: '50px',
						fontWeight: 700,
					}}
					onClick={() =>
						setImageIndex(imageIndex < 7 ? imageIndex + 1 : imageIndex)
					}
				>
					<IoIosArrowForward />
				</button>
			</section>
			<Search />
			<section className={'featuredDestinations'}>
				<h2>Белгилуу турлар</h2>
				<div className={'destinationGrid'}>
					{slicedTours?.map((el) => (
						<TourCard key={el.id} tour={el} />
					))}
				</div>
			</section>
		</div>
	)
}
