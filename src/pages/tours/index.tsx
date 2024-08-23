/** @format */

import React, { useEffect, useMemo, useState } from "react"
import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook"
import { sortTours } from "./sortMethods"
import { FaHeart } from "react-icons/fa"
import pb from "@/lib/pocketbase"
import { user } from "@/components/userDataOnLocalStorage"
import "@/styles/tourPage.scss"

const Tours = () => {
	const [currentSort, setCurrentSort] = useState("default")
	const [currentLocation, setCurrentLocation] = useState("all")
	const [sortByPriceTo, setSortByPriceTo] = useState("1000000")
	const [sortByPriceFrom, setSortByPriceFrom] = useState("0")
	const { getTours, addLikedTour } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)

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

	const TourCard = ({ tour }) => {
		const [isLiked, setIsLiked] = useState(false)

		useEffect(() => {
			const checkIfLiked = async () => {
				try {
					const userData = await pb.collection("users").getOne(user?.userId)
					setIsLiked(userData.likedTours.includes(tour.id))
				} catch (error) {
					console.error("Error fetching user data:", error)
				}
			}

			checkIfLiked()
		}, [tour.id])

		const handleLike = async () => {
			try {
				await addLikedTour(user?.userId, tour.id)
				setIsLiked(!isLiked)
			} catch (error) {
				console.error("Error adding liked tour:", error)
			}
		}

		console.log(tour.id + " " + isLiked)
		console.log("tour.images[0]", tour.images[0])
		console.log(
			`https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${tour.id}/${tour.images[0]})`
		)
		return (
			<div
				className="tours__card"
				style={{
					backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
						tour.id
					}/${
						Array.isArray(tour.images) ? tour.images[0] : tour.images
					}?token=)`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center center",
					backgroundSize: "cover",
				}}
			>
				<div className="tours__card-image">
					<h3 className="tours__card-title">{tour.title}</h3>
					<p className="tours__card-price">Цена: {tour.price} сом</p>
					<span
						className={`tours__card-like ${
							isLiked ? "tours__card-like--active" : ""
						}`}
						onClick={handleLike}
					>
						<FaHeart />
					</span>
				</div>
			</div>
		)
	}

	return (
		<div className="tours">
			<div className="tours__container">
				<h1 className="tours__title">Туры</h1>
				<div className="tours__content">
					<div className="tours__sort">
						<div className="tours__sort-wrapper">
							<div className="tours__sort-item">
								<select
									className="tours__sort-select"
									value={currentSort}
									onChange={handleSortChange}
								>
									<option value="default">По умолчанию</option>
									<option value="asc">По возрастанию цены</option>
									<option value="dsc">По убыванию цены</option>
									<option value="A-Z">А-Я</option>
									<option value="Z-A">Я-А</option>
								</select>
							</div>
							<div className="tours__sort-item">
								<select
									className="tours__sort-select"
									value={currentLocation}
									onChange={handleLocationChange}
								>
									<option value="all">Все локации</option>
									<option value="Ош">Ош</option>
									<option value="Жалал-Абад">Жалал-Абад</option>
									<option value="Баткен">Баткен</option>
									<option value="Чуй">Чуй</option>
									<option value="Бишкек">Бишкек</option>
									<option value="Талас">Талас</option>
									<option value="Нарын">Нарын</option>
								</select>
							</div>
							<div className="tours__sort-item">
								<input
									type="number"
									className="tours__sort-input"
									placeholder="от"
									value={sortByPriceFrom}
									onChange={e => handlePriceChange(e, true)}
								/>
								<input
									type="number"
									className="tours__sort-input"
									placeholder="до"
									value={sortByPriceTo}
									onChange={e => handlePriceChange(e, false)}
								/>
							</div>
						</div>
					</div>
					<div className="tours__list">
						{sortedTours && sortedTours.length > 0 ? (
							sortedTours.map(tour => <TourCard key={tour.id} tour={tour} />)
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
