/** @format */
"use client"
import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import "../../styles/regions_details.scss"

export default function RegionDetails() {
	const { id } = useParams()
	const { getRegions, getTours } = UseTypedDispatch()
	const regionState = useTypedSelectorHook(state => state.tours.regions)
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const { items } = regionState

	useEffect(() => {
		getRegions()
		getTours()
	}, [])

	const filteredRegion = items?.find(r => r.id === id)
	const filteredTours = tours.items?.filter(
		t => t.location === filteredRegion?.title
	)

	if (!filteredRegion) {
		return <h1>Region not found</h1>
	}

	console.log("tours", tours)
	return (
		<div className={"container"}>
			<div className={"region"}>
				<div key={filteredRegion.id} className={"regionCard"}>
					<div className={"regionImageTitle"}>
						<img
							src={`https://kyrgyz-tra.pockethost.io/api/files/29nabdum39hq6n2/${filteredRegion.id}/${filteredRegion.image}?token=`}
							alt={filteredRegion.name}
							width={500}
							height={500}
						/>
						<h1 className={"title"}>{filteredRegion.title}</h1>

						<p
							className={"tourDescription"}
							dangerouslySetInnerHTML={{ __html: filteredRegion.description }}
						/>
					</div>
				</div>

				<div>
					<p>Все туры в регионе</p>
					<div className={"toursGrid"}>
						{filteredTours?.map(t => (
							<div className={"toursCard"} key={t.id}>
								<Link to={`/tour_details/${t.id}`}>
									<img
										className={"image"}
										src={`https://kyrgyz-tra.pockethost.io/api/files/tours/${t.id}/${t.images[0]}?token=`}
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
