/** @format */
"use client"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import Search from "../../components/search/search"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import "@/styles/page.scss"
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export default function Home() {
	const regions = useTypedSelectorHook(state => state.tours.regions)
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const lastFetchTime = useTypedSelectorHook(state => state.tours.lastFetchTime)
	const { getRegions, getTours } = UseTypedDispatch()
	const { items } = regions

	useEffect(() => {
		const shouldFetchData =
			!lastFetchTime || Date.now() - lastFetchTime > CACHE_DURATION
		if (shouldFetchData) {
			getRegions()
			getTours()
		}
	}, [])

	const slicedTours = tours.items?.slice(0, 4)
	return (
		<div className={"homePage"}>
			<section className={"hero"}>
				<h1>Откройте для себя красоту Кыргызстана</h1>
				<p>
					Планируйте свое путешествие, бронируйте туры и делитесь впечатлениями
				</p>
				<Search />
			</section>
			<section className={"featuredDestinations"}>
				<h2>Популярные направления</h2>
				<div className={"destinationGrid"}>
					{slicedTours?.map(el => (
						<Link
							style={{ zIndex: 100 }}
							to={`/tour_details/${el.id}`}
							key={el.id}
						>
							<div
								key={el.id}
								className={"destinationCard"}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
										el.id
									}/${
										Array.isArray(el.images) ? el.images[0] : el.images
									}?token=)`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center center",
									backgroundSize: "cover",
								}}
							>
								<h3>{el.title}</h3>
							</div>
						</Link>
					))}
				</div>
			</section>
			<section className={"popularTours"}>
				<h2>Все области</h2>
				<div className={"regionsGrid"}>
					{items?.map(el => (
						<Link to={`/region_details/${el.id}`} key={el.id}>
							<div
								className={"regionCard"}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${el.id}/${el.image}?token=)`,
									backgroundRepeat: "no-repeat",
									backgroundPosition: "center center",
									backgroundSize: "cover",
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
