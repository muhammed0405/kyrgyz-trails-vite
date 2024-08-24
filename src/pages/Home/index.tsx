/** @format */
'use client'
import '@/styles/page.scss'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Search from '@/components/search/search'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export default function Home() {
	const regions = useTypedSelectorHook((state) => state.tours.regions)
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const lastFetchTime = useTypedSelectorHook(
		(state) => state.tours.lastFetchTime
	)
	const { getRegions, getTours } = UseTypedDispatch()
	const { items = [] } = regions // Default to an empty array if items is undefined
	const [imageIndex, setImageIndex] = useState(0)

	useEffect(() => {
		const shouldFetchData =
			!lastFetchTime || Date.now() - lastFetchTime > CACHE_DURATION
		if (shouldFetchData) {
			getRegions()
			getTours()
		}
	}, [lastFetchTime, getRegions, getTours])

	useEffect(() => {
		const interval = setInterval(() => {
			setImageIndex((prevCount) => (prevCount >= 7 ? 0 : prevCount + 1))
		}, 5000)

		return () => clearInterval(interval)
	}, [])

	const slicedTours = tours.items?.slice(0, 4)
	console.log('items', items.id)

	const selectedImage = items[imageIndex]

	const backgroundImage = `https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${selectedImage?.id}/${selectedImage?.image}?token=`
	return (
		<div className={'homePage'}>
			<section
				style={{
					position: 'relative',
				}}
				className={'hero'}
			>
				<img
					style={{
						position: 'absolute',
						zIndex: 0,
						width: '100%',
						maxWidth: '1520px',
						height: '500px',
					}}
					src={backgroundImage}
					alt='it is an image '
				/>

				<h1
					style={{
						zIndex: 1,
					}}
				>
					Откройте для себя красоту Кыргызстана
				</h1>
				<p
					style={{
						zIndex: 1,
					}}
				>
					Планируйте свое путешествие, бронируйте туры и делитесь впечатлениями
				</p>
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
				<Search />
			</section>
			<section className={'featuredDestinations'}>
				<h2>Популярные направления</h2>
				<div className={'destinationGrid'}>
					{slicedTours?.map((el) => (
						<Link
							style={{ zIndex: 100 }}
							to={`/tour_details/${el.id}`}
							key={el.id}
						>
							<div
								key={el.id}
								className={'destinationCard'}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
										el.id
									}/${
										Array.isArray(el.images) ? el.images[0] : el.images
									}?token=)`,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
									backgroundSize: 'cover',
								}}
							>
								<h3>{el.title}</h3>
							</div>
						</Link>
					))}
				</div>
			</section>
			<section className={'popularTours'}>
				<h2>Все области</h2>
				<div className={'regionsGrid'}>
					{items?.map((el) => (
						<Link to={`/region_details/${el.id}`} key={el.id}>
							<div
								className={'regionCard'}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${el.id}/${el.image}?token=)`,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
									backgroundSize: 'cover',
								}}
							>
								<h3>{el.title}</h3>
							</div>
						</Link>
					))}
				</div>
			</section>
		</div>
	)
}
