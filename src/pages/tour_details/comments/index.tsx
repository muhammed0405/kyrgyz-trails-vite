/** @format */

import CustomToast, {
	showErrorToast,
	showSuccessToast,
} from "@/components/common/toaster/customToast"
import { user } from "@/components/userDataOnLocalStorage"
import pb from "@/lib/pocketbase"
import { useState } from "react"
import "./comment.scss"

export default function Comments({ tour_id }: { tour_id: string }) {
	const [comments, setComments] = useState("")
	const [starState, setStarState] = useState(0)
	const [commentList, setCommentList] = useState<IComment[]>([])

	interface IComment {
		id: string
		comment: string
		star: number
		user: string
		tour: string
	}

	const data: IComment = {
		id: "", // Placeholder for the ID
		comment: comments,
		star: starState,
		user: user?.userId,
		tour: tour_id,
	}

	const addComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!user.userId) {
			showErrorToast("Вы должны войти в аккаунт")
			return
		}
		try {
			await pb.collection("comments").create(data)
			showSuccessToast("Комментарий добавлен")
			fetchComments()
		} catch (err) {
			console.log(err)
			showErrorToast("Комментарий не добавлен")
		}
	}

	const fetchComments = async () => {
		try {
			const fetchedComments = await pb.collection("comments").getList(1, 50, {
				filter: `tour = "${tour_id}"`,
			})
			setCommentList(fetchedComments.items)
		} catch (err) {
			console.error("Error fetching comments:", err)
			showErrorToast("Не удалось загрузить комментарии")
		}
	}

	const handleStarClick = (rating: number) => {
		// If the clicked star is already selected, decrease the rating
		if (starState === rating) {
			setStarState(rating - 1)
		} else {
			setStarState(rating)
		}
	}

	return (
		<div>
			<h1 className="comments_title">Оставьте комментарий</h1>

			<form onSubmit={addComment}>
				<input
					className="comment_input"
					type="text"
					onChange={e => setComments(e.target.value)}
					required
				/>
				<div className="stars">
					{[1, 2, 3, 4, 5].map(star => (
						<span
							key={star}
							className={`star ${star <= starState ? "filled" : ""}`}
							onClick={() => handleStarClick(star)}
						>
							★
						</span>
					))}
				</div>
				<button className="add_comment_btn" type="submit">
					Добавить	
				</button>
				<CustomToast />
			</form>
		</div>
	)
}
