import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'
import tourPageStyles from '../../styles/tourPage.module.scss'
const Tours = () => {
	const [currentSort, setCurrentSort] = useState('default')
	const [currentLocation, setCurrentLocation] = useState('all')
	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook((state) => state.tours.tours)
	const [sortByPriceTo, setSortByPriceTo] = useState('1000000')
	const [sortByPriceFrom, setSortByPriceFrom] = useState('0')

	useEffect(() => {
		getTours()
	}, [])

	const sortTours = useCallback(
		(items: any, sortType: any) => {
			if (!items || !Array.isArray(items)) return []
			const itemsCopy = [...items]
			switch (sortType) {
				case 'asc':
					return itemsCopy.sort((a, b) => (a.price || 0) - (b.price || 0))
				case 'dsc':
					return itemsCopy.sort((a, b) => (b.price || 0) - (a.price || 0))
				case 'A-Z':
					return itemsCopy.sort((a, b) => a.title.localeCompare(b.title))
				case 'Z-A':
					return itemsCopy.sort((a, b) => b.title.localeCompare(a.title))
				case 'price':
					return itemsCopy.filter(
						(item) =>
							item.price >= Number(sortByPriceFrom) &&
							item.price <= Number(sortByPriceTo)&&item.location===currentLocation&&item
					)
				case 'location':
					return itemsCopy.filter((item) => item.location === currentLocation)
        
				default:
					return itemsCopy
			}
		},
		[sortByPriceFrom, sortByPriceTo, currentLocation]
	)

	const sortedTours = useMemo(() => {
		return sortTours(tours.items, currentSort)
	}, [
		tours.items,
		currentSort,
		sortTours,
		sortByPriceFrom,
		sortByPriceTo,
		currentLocation,
	])

	useEffect(() => {
		console.log('Current sort:', currentSort) // Debug log
	}, [currentSort])

	const handleSortChange = (e: { target: { value: any } }) => {
		const newSort = e.target.value
		console.log('Changing sort to:', newSort) // Debug log
		setCurrentSort(newSort)
	}

	return (
		<div>
			<div>
				<h1>Tours</h1>
			</div>
			<div className={tourPageStyles.toursAndSortWrapper}>
				<div className={tourPageStyles.sortWrapper}>
					<select value={currentSort} onChange={handleSortChange}>
						<option value='default'>По умолчанию</option>
						<option value='asc'>По возрастанию цены</option>
						<option value='dsc'>По убыванию цены</option>
						<option value='A-Z'>А-Я</option>
						<option value='Z-A'>Я-А</option>
					</select>

					<select
						value={currentLocation}
						onChange={(e) => {
							setCurrentLocation(e.target.value)
							setCurrentSort('location')
						}}
					>
						
						<option value='Ош'>Ош</option>
						<option value='Жалал-Абад'>Жалал-Абад</option>
						<option value='Баткен'>Баткен</option>
						<option value='Чуй'>Чуй</option>
						<option value='Бишкек'>Бишкек</option>
						<option value='Талас'>Талас</option>
						<option value='Нарын'>Нарын</option>
					</select>

					<div>
						<input
							type='number'
							placeholder='от'
							value={sortByPriceFrom}
							onChange={(e) => {
								setSortByPriceFrom(e.target.value)
								setCurrentSort('price')
							}}
						/>
						<input
							type='number'
							placeholder='до'
							value={sortByPriceTo}
							onChange={(e) => {
								setSortByPriceTo(e.target.value)
								setCurrentSort('price')
							}}
						/>
					</div>
				</div>
				<div className={tourPageStyles.toursWrapper}>
					{sortedTours && sortedTours.length > 0 ? (
						sortedTours.map((el) => (
							<Link to={`/tour_details/${el.id}`} key={el.id}>
								<div
									className={tourPageStyles.tourCard}
									style={{
										backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center center',
										backgroundSize: 'cover',
									}}
								>
									<h3>{el.title}</h3>
									<p className={tourPageStyles.price}>Цена: {el.price} сом</p>
								</div>
							</Link>
						))
					) : (
						<p>Туры не доступны</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Tours
