/** @format */

import {
	showErrorToast,
	showSuccessToast,
} from '@/components/common/toaster/customToast'
import { user } from '@/components/userDataOnLocalStorage'
import pb from '@/lib/pocketbase'
import { UseTypedDispatch } from '@/Redux/customHooks/useTypedDispatch'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './comment.scss'

export default function Comments({ tour_id }: { tour_id: string }) {
	const [comments, setComments] = useState('')
	const [starState, setStarState] = useState(0)
	const { addComment } = UseTypedDispatch()
	const [commentAdded, setCommentAdded] = useState(false)
	const params = useParams()

	interface IComment {
		id: string
		comment: string
		star: number
		user: string
		tour: string
	}

	const data: IComment = {
		comment: comments,
		star: starState,
		user: user?.userId,
		tour: tour_id,
	}

	const handleSubmit = (e) => {
		e.preventDefault()

		if (!user.userId) {
			showErrorToast('Вы должны войти в аккаунт')
			return
		}
		try {
			addComment(data)
			showSuccessToast('Комментарий добавлен')
			setComments('') // Clear the comment input after submission
			setStarState(0) // Reset star rating
		} catch (err) {
			console.log(err)
			showErrorToast('Комментарий не добавлен')
		}
	}

	const handleStarClick = (rating: number) => {
		if (starState === rating) {
			setStarState(rating - 1)
		} else {
			setStarState(rating)
		}
	}

	useEffect(() => {
		const amIAddedComment = async () => {
			try {
				const fetchedComment = await pb
					.collection('comments')
					.getFirstListItem(
						`tour = "${params.id}" and user = "${user?.userId}"`
					)

				setCommentAdded(true)
				console.log('fetchedComment', fetchedComment)
			} catch (err) {
				setCommentAdded(false)
			}
		}
		amIAddedComment()
	}, [])

	if (commentAdded) {
		return <div>Вы уже оставляли комментарий</div> // Message displayed if comment exists
	}

	return (
		<form onSubmit={handleSubmit}>
			<h3 className='comments_title'>Оставьте комментарий</h3>
			<textarea
				className='comment_input'
				value={comments}
				onChange={(e) => setComments(e.target.value)}
				required
			/>
			<div className='stars'>
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`star ${star <= starState ? 'filled' : ''}`}
						onClick={() => handleStarClick(star)}
					>
						★
					</span>
				))}
			</div>
			<button className='add_comment_btn' type='submit'>
				Добавить
			</button>
		</form>
	)
}
