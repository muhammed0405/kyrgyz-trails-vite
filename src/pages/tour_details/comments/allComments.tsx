/** @format */

import { showErrorToast } from "@/components/common/toaster/customToast"
import pb from "@/lib/pocketbase"
import { useEffect, useState } from "react"
import "./allComments.scss"
import { IComments } from "@/Redux/Interfaces/tourReducerType"
import { useParams } from "react-router-dom"
import { UseTypedDispatch } from "@/Redux/customHooks/useTypedDispatch"
import { useTypedSelectorHook } from "@/Redux/customHooks/useTypedSelectorHook"

export default function AllComments() {
	const comments = useTypedSelectorHook(state => state.tours.comments)
	const params = useParams()

	const { fetchComments } = UseTypedDispatch()

	useEffect(() => {
		fetchComments(params.id)
	}, [])

	if (comments.length === 0) {
		return (
			<div className="comments-container-empty">
				<h1 className="comments-title">Комментариев нет</h1>
				<button
					className="comments__back-button"
					onClick={() => window.history.back()}
				>
					Вернуться назад
				</button>
			</div>
		)
	}

	console.log("comments", comments)

	return (
		<div className="comments-container">
			<h1>
				<div className="comments-summary">
					<p>Всего комментариев: {comments.length}</p>
					<p>
						Средний оценок:{" "}
						{(
							comments.reduce((a, b) => a + b.star, 0) / comments.length
						).toFixed(1)}
					</p>
				</div>
				<div className="comments-grid">
					{comments.map((comment: IComments) => (
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
