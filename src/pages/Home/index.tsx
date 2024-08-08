/** @format */

import { Link } from "react-router-dom"
import { useEffect } from "react"
import Search from "../../components/search/search"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import styles from "../../styles/page.module.scss"

export default function Home() {
	const regions = useTypedSelectorHook(state => state.tours.regions)
	const { getRegions, getTours } = UseTypedDispatch()
	const { items } = regions
	console.log("regions main page", items)

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	return (
		<div className={styles.homePage}>
			<section className={styles.hero}>
				<h1>Откройте для себя красоту Кыргызстана</h1>
				<p>
					Планируйте свое путешествие, бронируйте туры и делитесь впечатлениями
				</p>
				<Search />
			</section>
			<section className={styles.featuredDestinations}>
				<h2>Популярные направления</h2>
				<div className={styles.destinationGrid}>
					{["Иссык-Куль", "Ала-Арча", "Сон-Куль", "Джети-Огуз"].map(
						destination => (
							<div key={destination} className={styles.destinationCard}>
								<h3>{destination}</h3>
							</div>
						)
					)}
				</div>
			</section>
			<section className={styles.popularTours}>
				<h2>Все области</h2>
				<div className={styles.regionsGrid}>
					{items?.map(el => (
						<Link to={`/region_details/${el.id}`} key={el.id}>
							<div
								className={styles.regionCard}
								style={{
									backgroundImage: `url(http://127.0.0.1:8090/api/files/29nabdum39hq6n2/${el.id}/${el.image}?token=)`,
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
