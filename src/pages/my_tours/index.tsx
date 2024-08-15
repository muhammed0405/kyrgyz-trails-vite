/** @format */

import React, { useEffect } from "react"
import pb from "../../lib/pocketbase"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { Link } from "react-router-dom"
export default function MyTours() {
	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)

	const authData = localStorage.getItem("pocketbase_auth")

	const userId = JSON.parse(authData)

	const sortedTours = tours.items?.filter(el => el.guide_id === userId.userId)

	useEffect(() => {
		getTours()
	}, [])

	if (!sortedTours) return <div>Туров нет</div>

	return (
		<div>
			<h1>Мои туры</h1>
			{sortedTours?.map(el => (
				<Link
					to={`/tour_details/${el.id}`}
					style={{ textDecoration: "none", height: "300px" }}
					key={el.id}
				>
					<div
						style={{
							backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "center center",
							backgroundSize: "cover",

							height: "200px",
							width: "200px",
							color: "red",
							fontSize: "20px",
							fontWeight: "700",
						}}
					>
						<h3>{el.title}</h3>
						<p>Цена: {el.price} сом</p>
					</div>
				</Link>
			))}
		</div>
	)
}
