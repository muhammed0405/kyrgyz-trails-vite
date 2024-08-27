/** @format */

import { useEffect, useState, useMemo } from "react"
import pb from "@/lib/pocketbase"
import { FaHeart } from "react-icons/fa"
import { Link } from "react-router-dom"
import { user } from "./userDataOnLocalStorage"
import CustomToast, { showErrorToast } from "./common/toaster/customToast"
import "@/styles/tourPage.scss"

const TourCard = ({ tour }) => {
	const [isLiked, setIsLiked] = useState(false)
	const [likedTours, setLikedTours] = useState(new Set())

	useEffect(() => {
		const fetchLikedTours = async () => {
			if (!user?.userId) return

			try {
				const response = await pb.collection("liked_tours").getFullList({
					filter: `user_id = "${user.userId}"`,
				})
				const likedTourIds = new Set(response.map(item => item.tour_id))
				setLikedTours(likedTourIds)
				setIsLiked(likedTourIds.has(tour.id))
			} catch (error) {
				console.error("Error fetching liked tours:", error)
			}
		}

		fetchLikedTours()
	}, [tour.id, user?.userId])

	const toggleLike = async () => {
		if (!user?.userId) {
			return showErrorToast("You need to log in to like a tour")
		}

		// Optimistically toggle the like state
		setIsLiked(prevState => !prevState)

		try {
			if (isLiked) {
				const likedTour = await pb
					.collection("liked_tours")
					.getFirstListItem(
						`user_id = "${user.userId}" && tour_id = "${tour.id}"`
					)
				await pb.collection("liked_tours").delete(likedTour.id)
				setLikedTours(prev => {
					const updated = new Set(prev)
					updated.delete(tour.id)
					return updated
				})
			} else {
				await pb.collection("liked_tours").create({
					user_id: user.userId,
					tour_id: tour.id,
				})
				setLikedTours(prev => new Set(prev).add(tour.id))
			}
		} catch (error) {
			console.error("Error toggling like:", error)
			// Revert state if there's an error
			setIsLiked(prevState => !prevState)
		}
	}

	return (
		<div className="tours__card-wrapper" style={{ position: "relative" }}>
			<span
				className={`tours__card-like ${
					isLiked ? "tours__card-like--active" : ""
				}`}
				onClick={toggleLike}
				style={{
					color: isLiked ? "red" : "white",
					cursor: "pointer",
					fontSize: "30px",
					width: "40px",
					height: "40px",
				}}
			>
				<FaHeart />
			</span>
			<Link to={`/tour_details/${tour.id}`}>
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
					</div>
					<p>{user?.username}</p>
				</div>
			</Link>
			<CustomToast />
		</div>
	)
}

export default TourCard
