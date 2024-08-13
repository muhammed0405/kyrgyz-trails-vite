/** @format */

import { useEffect } from "react"
import { Link } from "react-router-dom"
import Search from "../../components/search/search"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import styles from "../../styles/page.module.scss"

export default function Home() {
	const regions = useTypedSelectorHook(state => state.tours.regions)
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const { getRegions, getTours } = UseTypedDispatch()
	const { items } = regions

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const slicedTours = tours.items?.slice(0, 4)
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
					{slicedTours?.map(el => (
						<Link to={`/tour_details/${el.id}`} key={el.id}>
							<div
								key={el.id}
								className={styles.destinationCard}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${
										el.id
									}/${
										Array.isArray(el.image) ? el.images[0] : el.images
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
			<section className={styles.popularTours}>
				<h2>Все области</h2>
				<div className={styles.regionsGrid}>
					{items?.map(el => (
						<Link to={`/region_details/${el.id}`} key={el.id}>
							<div
								className={styles.regionCard}
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
