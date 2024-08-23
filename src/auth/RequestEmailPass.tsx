import CustomToast, {
	showErrorToast,
	showSuccessToast,
} from '@/components/common/toaster/customToast'
import pb from '@/lib/pocketbase'
import { useState } from 'react'

const RequestEmailPass = () => {
	const [email, setEmail] = useState('')

	const requestChange = async (el) => {
		el.preventDefault()
		try {
			// Колдонуучуну email аркылуу издөө
			// const user = await pb
			// 	.collection('users')
			// 	.getFirstListItem(`email="${email}"`)

			// console.log('Found user:', user) // Табылган колдонуучуну консолго чыгарабыз

			// Эгер колдонуучу табылса, пароль өзгөртүү сурамын жөнөтөбүз
			await pb.collection('users').requestPasswordReset(email)
			showSuccessToast('Ссылка для смены пароля отправлена на вашу почту')
		} catch (error) {
			console.error('Error:', error)
			if (error.status === 404) {
				showErrorToast('Пользователя с таким email не существует')
			} else {
				showErrorToast('Ошибка: ' + (error.message || 'Неизвестная ошибка'))
			}
		}
	}

	return (
		<div className='request-style'>
			<h1>Напишите ваш email</h1>
			<form onSubmit={requestChange}>
				<input
					onChange={(e) => setEmail(e.target.value)}
					type='email'
					value={email}
					required
				/>
				<button type='submit'>Подтвердить</button>
			</form>
			<CustomToast />
		</div>
	)
}

export default RequestEmailPass
