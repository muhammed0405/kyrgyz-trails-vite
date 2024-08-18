/** @format */

import '@/styles/auth_styles/verify.scss'
import PocketBase from 'pocketbase'
import { useNavigate } from 'react-router-dom'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'
import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

const VerifyEmail = () => {
	const { email, password, isAuth } = useTypedSelectorHook(
		(state) => state.auth
	)
	const { loginAfterVerification } = UseTypedDispatch()
	const navigate = useNavigate()

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		checkVerification({ email, password })
	// 	}, 10000)
	// }, [email])

	if (isAuth) {
		navigate('/')
	}

	return (
		<div className='verify'>
			<h1>Подтвердите свою почту</h1>
			<p className='verify__text'>
				Мы отправили ссылку для подтверждения на ваш электронный адрес {email}.
				<br />
				Пожалуйста, перейдите в Вашу почту и нажмите на ссылку для подтверждения
				email.
			</p>

			<h1 className='verify__text'>
				Если подтвердили свою почту нажмите на кнопку
			</h1>
			<button
				className='verify__btn'
				onClick={() => loginAfterVerification(email, password)}
			>
				Проверил{' '}
			</button>
		</div>
	)
}

export default VerifyEmail
