/** @format */
'use client'
import '@/styles/page.scss'
import { useEffect, useState } from 'react'

import Search from '@/components/search/search'
import TourCard from '@/components/tourCard'
import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

export default function Home() {
	const regions = useTypedSelectorHook((state) => state.tours.regions)
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const [allComments, setAllComments] = useState([])
	const { getRegions, getTours } = UseTypedDispatch()
	const { items = [] } = regions // Default to an empty array if items is undefined
	const [imageIndex, setImageIndex] = useState(0)
	const fetchComments = async () => {
		try {
			const comments = await pb.collection('comments').getFullList()
			setAllComments(comments)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getRegions()
		getTours()
		fetchComments()
	}, [])
	const getPopularTours = () => {
		// Эсептейбиз ар бир тур үчүн рейтингди
		const toursWithRating = tours.items?.map((tour) => {
			const tourComments = allComments.filter(
				(comment) => comment.tour === tour.id
			)
			const averageRating =
				tourComments.reduce((acc, comment) => acc + comment.star, 0) /
					tourComments.length || 0
			return {
				...tour,
				rating: averageRating * 0.7 + tourComments.length * 0.3, // 70% жылдызча, 30% комментарий саны
			}
		})

		// Рейтинг боюнча сорттойбуз жана биринчи 4 турду кайтарабыз
		return toursWithRating?.sort((a, b) => b.rating - a.rating).slice(0, 4)
	}

	const popularTours = getPopularTours()

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
			}, 2000)
		}, 5000)

		return () => clearInterval(interval)
	}, [imageIndex, items])

	const slicedTours = tours.items?.sort((a, b) => a.star - b.star).slice(0, 4)
	console.log('items', tours?.items)

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
							maxWidth: '1520px',
							maxHeight: '500px',
							width: '100%',
							height: '100%',
						}}
						src={currentImage}
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
					<h1>Откройте для себя чудеса Кыргызстана</h1>
					<p>
						Планируйте свои путешествие , посетите самые известные места
						Кыргызстана и получите не забываемые впечатления
					</p>
				</div>
				{/* <button
					style={{
						zIndex: 1,
						position: "absolute",
						left: "10px",
						top: "220px",
						padding: "10px",
						border: "none",
						cursor: "pointer",
						background: "transparent",
						color: "#fff",
						fontSize: "50px",
						fontWeight: 700,
					}}
					onClick={() => setImageIndex(imageIndex > 0 ? imageIndex - 1 : 7)}
				>
					<IoIosArrowBack />
				</button>
				<button
					style={{
						zIndex: 1,
						position: "absolute",
						right: "10px",
						top: "220px",
						padding: "10px",
						border: "none",
						cursor: "pointer",
						background: "transparent",
						color: "#fff",
						fontSize: "50px",
						fontWeight: 700,
					}}
					onClick={() =>
						setImageIndex(imageIndex < 7 ? imageIndex + 1 : imageIndex)
					}
				>
					<IoIosArrowForward />
				</button> */}
			</section>
			<Search />
			<h2 className={'popular__tours__title'}>Популярные туры</h2>
			<section className={'featuredDestinations'}>
				<div className={'tours__list'}>
					{popularTours?.map((tour) => (
						<TourCard key={tour.id} tour={tour} />
					))}
				</div>
			</section>
		</div>
	)
}
