/** @format */

import { showErrorToast } from "@/components/common/toaster/customToast"
import pb from "@/lib/pocketbase"
import { useEffect, useState } from "react"
import "./allComments.scss"

export default function AllComments({ tour_id }: { tour_id: string }) {
	const [comments, setComments] = useState([])

	const getComments = async () => {
		try {
			const fetchedComments = await pb.collection("comments").getList(1, 50, {
				filter: `tour = "${tour_id}"`,
			})
			setComments(fetchedComments.items)
		} catch (err) {
			console.error("Error fetching comments:", err)
			showErrorToast("Не удалось загрузить комментарии")
		}
	}

	useEffect(() => {
		getComments()
	}, [])

	return (
		<div className="comments-container">
			<h1>
				<div className="comments-summary">
					<p>Всего комментариев: {comments.length}</p>
					<p>
						Средний оценок:{" "}
						{comments.reduce((a, b) => a + b.star, 0) / comments.length}
					</p>
				</div>
				<div className="comments-grid">
					{comments.map((comment: any) => (
						<div className="comment-card" key={comment.id}>
							<p>
								<span className="comment-label">текст коментов:</span>{" "}
								{comment.comment}
							</p>
							<p>Оценка: {comment.star}</p>
						</div>
					))}
				</div>
			</h1>
		</div>
	)
}
