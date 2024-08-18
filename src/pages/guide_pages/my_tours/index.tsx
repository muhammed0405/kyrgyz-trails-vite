/** @format */

import { useEffect } from "react"
import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook"
import { Link, useNavigate } from "react-router-dom"
import "@/styles/my_tours.scss"
import { ITour } from "@/Redux/Interfaces/tourReducerType"

export default function MyTours() {
	const { getTours } = UseTypedDispatch()
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const navigate = useNavigate()

	const authData = localStorage.getItem("pocketbase_auth")
	const userId = authData ? JSON.parse(authData).userId : null

	const sortedTours = tours.items?.filter((el: ITour) => el.guide_id === userId)

	useEffect(() => {
		getTours()
	}, [])

	const formatCreationDay = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })
	}

	const handleEdit = (tourId: string) => {
		navigate(`/update-tour/${tourId}`)
	}

	if (!sortedTours || sortedTours.length === 0)
		return <div className={"noToursMessage"}>У вас пока нет туров</div>

	return (
		<div className={"pageContainer"}>
			<h1 className={"pageTitle"}>Мои Захватывающие Туры</h1>
			<div className={"toursGrid"}>
				{sortedTours.map((el: ITour) => (
					<div className={"tourCard"} key={el.id}>
						<Link to={`/tour_details/${el.id}`} className={"tourLink"}>
							<div
								className={"tourImage"}
								style={{
									backgroundImage: `url(https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${el.id}/${el.images[0]})`,
								}}
							/>
							<div className={"tourInfo"}>
								<h3 className={"tourTitle"}>{el.title}</h3>
								<p className={"tourPrice"}>Цена: {el.price} сом</p>
								<p className={"tourCreationDate"}>
									Создано: {formatCreationDay(el.created)}
								</p>
							</div>
						</Link>
						<button className={"editButton"} onClick={() => handleEdit(el.id)}>
							✏️ Редактировать
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
