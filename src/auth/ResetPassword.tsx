import {
	showErrorToast,
	showSuccessToast,
} from '@/components/common/toaster/customToast'
import pb from '@/lib/pocketbase'
import { useState } from 'react'
import { user } from '../components/userDataOnLocalStorage'

const ResetPassword = () => {
	const [oldPassword, setOldPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (newPassword !== confirmPassword) {
			showErrorToast('Новые пароли не совпадают')
			return
		}

		try {
			// Биринчи, колдонуучунун учурдагы паролун текшеребиз
			await pb.collection('users').authWithPassword(user.email, oldPassword)

			// Эгер текшерүү ийгиликтүү болсо, паролду жаңыртабыз
			await pb.collection('users').update(user.id, {
				password: newPassword,
				passwordConfirm: confirmPassword,
			})

			showSuccessToast('Пароль успешно обновлен')

			// Жаңы пароль менен кайрадан авторизация кылабыз
			await pb.collection('users').authWithPassword(user.email, newPassword)
		} catch (error) {
			console.error('Error updating password:', error)
			showErrorToast('Ошибка при обновлении пароля: ' + error.message)
		}
	}

	return (
		<div>
			<h1>Обновление пароля</h1>

			<form onSubmit={handleSubmit}>
				<input
					type='password'
					placeholder='Старый пароль'
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
					required
				/>
				<input
					type='password'
					placeholder='Новый пароль'
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
					required
				/>
				<input
					type='password'
					placeholder='Подтвердите новый пароль'
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>

				<button type='submit'>Сменить пароль</button>
			</form>
		</div>
	)
}

export default ResetPassword
