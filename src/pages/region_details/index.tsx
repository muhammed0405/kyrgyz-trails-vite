/** @format */
"use client"
import { useEffect } from "react"

import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import styles from "../../styles/regions_details.module.scss"
import { Link, useParams } from "react-router-dom"

export default function RegionDetails() {
	const { getTours, getRegions } = UseTypedDispatch()
	const params = useParams()
	const regionState = useTypedSelectorHook(state => state.tours.regions)
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const { items } = regionState

	useEffect(() => {
		if (!regionState.items) {
			getRegions()
			getTours()
		}
	}, [])

	const filteredRegion = items.find(r => r.id === params.id)
	const filteredTours = tours.items?.filter(
		t => t.location === filteredRegion.title
	)
	console.log("filteredTours", filteredTours)

	if (!filteredRegion) {
		return <h1>Region not found</h1>
	}

	console.log("tours", tours)
	return (
		<div className={styles.container}>
			<div className={styles.region}>
				<div key={filteredRegion.id} className={styles.regionCard}>
					
					<div className={styles.regionImageTitle}>
					
						<img
							src={`https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${filteredRegion.id}/${filteredRegion.image}?token=`}
							alt={filteredRegion.name}
							width={500}
							height={500}
						/>
					<h1 className={styles.title}>{filteredRegion.title}</h1>
					
					<p
						className={styles.tourDescription}
						dangerouslySetInnerHTML={{ __html: filteredRegion.description }}
					/>
						</div>
				</div>

				<div>
					<p>Все туры в регионе</p>
					<div className={styles.toursGrid}>
						{filteredTours?.map(t => (
							<div className={styles.toursCard} key={t.id}>
								<Link to={`/tour_details/${t.id}`}>
									<img
										className={styles.image}
										src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${t.id}/${t.images}`}
										alt={"it is a tour"}
										width={500}
										height={500}
									/>
								</Link>
								<p>{t.title}</p>
								<p>{t.guide_id}</p>
								<p>{t.price}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
