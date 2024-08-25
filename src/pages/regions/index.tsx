/** @format */
'use client'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import '@/styles/page.scss'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export default function Regions() {
	const regions = useTypedSelectorHook((state) => state.tours.regions)
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const lastFetchTime = useTypedSelectorHook(
		(state) => state.tours.lastFetchTime
	)
	const { getRegions, getTours } = UseTypedDispatch()
	const { items = [] } = regions // Default to an empty array if items is undefined

	useEffect(() => {
		const shouldFetchData =
			!lastFetchTime || Date.now() - lastFetchTime > CACHE_DURATION
		if (shouldFetchData) {
			getRegions()
			getTours()
		}
	}, [lastFetchTime])

	return (
		<div className='regions-container'>
			<section className='popularTours'>
				<div className='regionsGrid'>
					{items.map((el) => (
						<div className='regions_block' key={el.id}>
							<Link to={`/region_details/${el.id}`} className='region-link'>
								<img
									src={`https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${el.id}/${el.image}?token=`}
									alt={el.title}
									className='regions_block__card'
								/>
							</Link>
							<h3>{el.title} область</h3>
							<div className='regions_block__title'>
						
								<h3>		{tours.items?.filter((tour) => tour.location === el.title.trim()).length} туров</h3>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
