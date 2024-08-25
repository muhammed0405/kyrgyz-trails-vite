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
	}, [lastFetchTime, getRegions])

	return (
		<div>
			<section className={'popularTours'}>
				<div className={'regionsGrid'}>
					{items.map((el) => (
						<div className='regions_block'>
							<div
								className={'regionCard'}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${el.id}/${el.image}?token=)`,
									backgroundRepeat: 'no-repeat',
									backgroundPosition: 'center center',
									backgroundSize: 'cover',
								}}
							></div>

							<h3>{el.title}</h3>
							<Link to={`/region_details/${el.id}`} key={el.id}>
								<div className='regions_block__title'>
									<h3>...</h3>
									{
										tours.items?.filter((tour) => tour.location === el.title)
											.length
									}
								</div>
							</Link>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}
