/** @format */

import pb from "@/lib/pocketbase"
import { useState } from "react"

export default function Comments({ tour_id }) {
	const [comments, setComments] = useState("")
	const [starState, setStarState] = useState(0)

	const addComment = async e => {
		e.preventDefault()
		if (!pb.authStore.isValid) {
			console.error("User is not authenticated")
			return
		}
		// ... rest of your code
	}
	const authData = JSON.parse(localStorage.getItem("pocketbase_auth"))
	const data = {
		comment: comments,
		star: starState,
		user: authData?.userId, // Use the authenticated user's ID
		tour: tour_id,
	}
	try {
		const response = pb.collection("comments").create(data)
		console.log("Comment added successfully:", response)
	} catch (error) {
		console.error("Error adding comment:", error.status)
		// Display error message to the user
	}

	return (
		<div>
			<h1>Comments</h1>

			<form onSubmit={addComment}>
				<input type="text" onChange={e => setComments(e.target.value)} />
				<input
					type="number"
					onChange={e => setStarState(Number(e.target.value))}
				/>

				<button type="submit">Add</button>
			</form>
		</div>
	)
}
