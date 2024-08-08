import { useState } from 'react'

export default function CommentForm({ tourId }) {
	const [comment, setComment] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)

		try {
			const result = await sendComment(comment, tourId)
			// Ийгиликтүү жөнөтүлгөндөн кийин форманы тазалайбыз
			setComment('')
			console.log('Comment submitted:', result)
			// Мында башка иш-аракеттерди кошсоңуз болот, мисалы, колдонуучуга билдирүү көрсөтүү
		} catch (err) {
			setError('Комментарий жөнөтүүдө ката кетти')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				placeholder='Комментарийиңизди жазыңыз'
				required
			/>
			<button type='submit' disabled={isLoading}>
				{isLoading ? 'Жөнөтүлүүдө...' : 'Жөнөтүү'}
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
		</form>
	)
}
