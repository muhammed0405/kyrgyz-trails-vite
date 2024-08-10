/** @format */

import { useEffect, useState } from "react"
import pb from "../../lib/pocketbase"
// import { useForm } from "react-hook-form"

interface Tours {
	id: string
	title: string
	description: string
	price: number
	image: string
}
export default function Auth() {
	const [isLoading, setIsLoading] = useState(false)
	const [tours, setTours] = useState([])
	// const { register, handleSubmit } = useForm()

	useEffect(() => {
		const getTours = async () => {
			setIsLoading(true)
			try {
				const records = await pb.collection("tours").getFullList({
					sort: "-created",
				})
				setTours(records.data.items)
				console.log("records", records)
			} catch (error) {
				console.error("Error fetching tours:", error)
			} finally {
				setIsLoading(false)
			}
		}

		getTours()
	}, [])

	return (
		<div>
			<h1>Auth</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{tours.map((tour: Tours) => (
						<div key={tour.id}>
							<li key={tour.id}>{tour.title}</li>
							<li>{tour.description}</li>
							<li>{tour.price}</li>
							<img
								src={`https://kyrgyz-tra.pockethost.io/api/files/6jd9gs9h9etivmp/${tour.id}/${tour.image}?token=`}
								alt="this image of tour"
							/>
						</div>
					))}
				</ul>
			)}
		</div>
	)
}
