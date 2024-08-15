/** @format */

// Tours.js
import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import tourPageStyles from "../../styles/tourPage.module.scss"
import { sortTours } from "./sortMethods"

const Tours = () => {
	const [currentSort, setCurrentSort] = useState("default")
	const [currentLocation, setCurrentLocation] = useState("all")
	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const [sortByPriceTo, setSortByPriceTo] = useState("1000000")
	const [sortByPriceFrom, setSortByPriceFrom] = useState("0")

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

	const handleSortChange = e => {
		setCurrentSort(e.target.value)
	}

	const handleLocationChange = e => {
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
		<div>
			<h1>Tours</h1>
			<div className={tourPageStyles.toursAndSortWrapper}>
				<div className={tourPageStyles.sortWrapper}>
					<select value={currentSort} onChange={handleSortChange}>
						<option value="default">По умолчанию</option>
						<option value="asc">По возрастанию цены</option>
						<option value="dsc">По убыванию цены</option>
						<option value="A-Z">А-Я</option>
						<option value="Z-A">Я-А</option>
					</select>

					<select value={currentLocation} onChange={handleLocationChange}>
						<option value="all">Все локации</option>
						<option value="Ош">Ош</option>
						<option value="Жалал-Абад">Жалал-Абад</option>
						<option value="Баткен">Баткен</option>
						<option value="Чуй">Чуй</option>
						<option value="Бишкек">Бишкек</option>
						<option value="Талас">Талас</option>
						<option value="Нарын">Нарын</option>
					</select>

					<div>
						<input
							type="number"
							placeholder="от"
							value={sortByPriceFrom}
							onChange={e => handlePriceChange(e, true)}
						/>
						<input
							type="number"
							placeholder="до"
							value={sortByPriceTo}
							onChange={e => handlePriceChange(e, false)}
						/>
					</div>
				</div>
				<div className={tourPageStyles.toursWrapper}>
					{sortedTours && sortedTours.length > 0 ? (
						sortedTours.map(el => (
							<Link to={`/tour_details/${el.id}`} key={el.id}>
								<div
									className={tourPageStyles.tourCard}
									style={{
										backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
										backgroundRepeat: "no-repeat",
										backgroundPosition: "center center",
										backgroundSize: "cover",
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
