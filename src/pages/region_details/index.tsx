/** @format */
'use client'
import TourCard from '@/components/tourCard'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
import '../../styles/regions_details.scss'

export default function RegionDetails() {
	const { id } = useParams()
	const { getRegions, getTours } = UseTypedDispatch()
	const regionState = useTypedSelectorHook((state) => state.tours.regions)
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const { items } = regionState

	useEffect(() => {
		getRegions()
		getTours()
	}, [getRegions, getTours]) // Added dependencies for useEffect

	const filteredRegion = items?.find((r) => r.id === id)
	const filteredTours = tours.items?.filter(
		(t) => t.location === filteredRegion?.title.trim()
	)

	if (!filteredRegion) {
		return <h1>Область не нашлось</h1>
	}

	return (
		<div className='container'>
			<div className='regionCard'>
				<div className='imageGallery'>
					<div className='mainImageWrapper'>
						<img
							className='mainImage'
							src={`https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${filteredRegion.id}/${filteredRegion.image}?token=`}
							alt={filteredRegion.name}
						/>
						<h1 className='regionTitle'>{filteredRegion.title}</h1>
					</div>
				</div>
				<div className='regionInfo'>
					<p
						className='regionDescription'
						dangerouslySetInnerHTML={{ __html: filteredRegion.description }}
					/>
				</div>
			</div>
			<h2 className='toursTitle'>Доступные туры</h2>
			<div className='tours_grid'>
				{filteredTours && filteredTours.length > 0 ? (
					filteredTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
				) : (
					<p className='noTours'>No tours available</p>
				)}
			</div>
		</div>
	)
}
