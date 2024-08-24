/** @format */

import TourCard from '@/components/tourCard'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '@/Redux/customHooks/useTypedSelectorHook'
import '@/styles/tourPage.scss'
import { useEffect, useMemo, useState } from 'react'
import { sortTours } from './sortMethods'

const Tours = () => {
	const [currentSort, setCurrentSort] = useState('default')
	const [currentLocation, setCurrentLocation] = useState('all')
	const [sortByPriceTo, setSortByPriceTo] = useState('1000000')
	const [sortByPriceFrom, setSortByPriceFrom] = useState('0')
	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook((state) => state.tours.tours)

	useEffect(() => {
		getTours()
	}, [])

	const sortedTours = useMemo(() => {
		return sortTours(
			tours.items,
			currentSort,
			sortByPriceFrom,
			sortByPriceTo,
			currentLocation
		)
	}, [
		tours.items,
		currentSort,
		sortByPriceFrom,
		sortByPriceTo,
		currentLocation,
	])

	const handleSortChange = (e) => {
		setCurrentSort(e.target.value)
	}

	const handleLocationChange = (e) => {
		setCurrentLocation(e.target.value)
	}

	const handlePriceChange = (e, isFrom) => {
		if (isFrom) {
			setSortByPriceFrom(e.target.value)
		} else {
			setSortByPriceTo(e.target.value)
		}
	}

	return (
		<div className='tours'>
			<div className='tours__container'>
				<h1 className='tours__title'>Туры</h1>
				<div className='tours__content'>
					<div className='tours__sort'>
						<div className='tours__sort-wrapper'>
							<div className='tours__sort-item'>
								<select
									className='tours__sort-select'
									value={currentSort}
									onChange={handleSortChange}
								>
									<option value='default'>По умолчанию</option>
									<option value='asc'>По возрастанию цены</option>
									<option value='dsc'>По убыванию цены</option>
									<option value='A-Z'>А-Я</option>
									<option value='Z-A'>Я-А</option>
								</select>
							</div>
							<div className='tours__sort-item'>
								<select
									className='tours__sort-select'
									value={currentLocation}
									onChange={handleLocationChange}
								>
									<option value='all'>Все локации</option>
									<option value='Ош'>Ош</option>
									<option value='Жалал-Абад'>Жалал-Абад</option>
									<option value='Баткен'>Баткен</option>
									<option value='Чуй'>Чуй</option>
									<option value='Бишкек'>Бишкек</option>
									<option value='Талас'>Талас</option>
									<option value='Нарын'>Нарын</option>
								</select>
							</div>
							<div className='tours__sort-item'>
								<input
									type='number'
									className='tours__sort-input'
									placeholder='от'
									value={sortByPriceFrom}
									onChange={(e) => handlePriceChange(e, true)}
								/>
								<input
									type='number'
									className='tours__sort-input'
									placeholder='до'
									value={sortByPriceTo}
									onChange={(e) => handlePriceChange(e, false)}
								/>
							</div>
						</div>
					</div>
					<div className='tours__list'>
						{sortedTours && sortedTours.length > 0 ? (
							sortedTours.map((tour) => <TourCard key={tour.id} tour={tour} />)
						) : (
							<p>Туры не найдены</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Tours
