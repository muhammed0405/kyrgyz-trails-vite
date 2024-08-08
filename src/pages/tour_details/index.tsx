/** @format */

"use client"
import { useParams } from "react-router-dom"
import CommentComponent from "../../components/common/commentsModal"
import { UseTypedDispatch } from "../../Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { useEffect, useState } from "react"
const TourDetails = () => {
	const params = useParams()
	const tours = useTypedSelectorHook(state => state.tours.tours)
	const filteredTour = tours.items.find(t => t.id === params.id)
	const { getTours } = UseTypedDispatch()
	useEffect(() => {
		getTours()
	}, [])
	console.log("filteredTour", filteredTour)

	console.log("filteredTour", filteredTour.id)
	const [showComments, setShowComments] = useState(false)
	return (
		<div>
			<button onClick={() => setShowComments(!showComments)}>
				{" "}
				Коментарии
			</button>
			{showComments ? <CommentComponent tourId={undefined} /> : ""}
			<img
				src={`http://127.0.0.1:8090/api/files/6jd9gs9h9etivmp/${filteredTour.id}/${filteredTour.image}?token=`}
				alt={filteredTour?.title}
				width={500}
				height={300}
			/>
			<p>{filteredTour?.title}</p>
			<p>{filteredTour?.description}</p>
			<p>{filteredTour?.comments}</p>

			{filteredTour && <h1>{filteredTour?.title}</h1>}
			<p>{filteredTour?.price}</p>
		</div>
	)
}

export default TourDetails
