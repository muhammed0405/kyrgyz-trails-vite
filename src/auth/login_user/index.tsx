/** @format */

// src/pages/LoginPages.tsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'

export default function LoginPages() {
	const navigate = useNavigate()
	const { loginAfterVerification } = UseTypedDispatch()

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}))
	}

	const validateForm = () => {
		if (!formData.email) {
			setError('Почта обязательна.')
			return false
		}
		if (!formData.password) {
			setError('Пароль обязателен.')
			return false
		}
		if (!/\S+@\S+\.\S+/.test(formData.email)) {
			setError('Пожалуйста, введите действительный адрес электронной почты.')
			return false
		}
		return true
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError(null)

		if (!validateForm()) {
			return
		}

		setIsLoading(true)

		try {
			const success = await loginAfterVerification(
				formData.email,
				formData.password
			)
			if (await success) {
				navigate('/')
			} else {
				setError('Вход не удался. Пожалуйста, попробуйте ещё раз.')
			}
		} catch (err) {
			setError('Неопознанная ошибка. Пожалуйста, попробуйте ещё раз.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className={loginContainer}>
			<div className={authContainer}>
				<form onSubmit={handleSubmit} className={authForm}>
					<h1>Войти</h1>
					<p
						style={{
							height: '40px',
						}}
					>
						{error && <p className={errorMessage}>{error}</p>}
					</p>
					<div className={formGroup}>
						<label htmlFor='email'>Почта:</label>
						<input
							className={formInput}
							type='email'
							id='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							required
							aria-required='true'
							aria-invalid={error && error.includes('email') ? 'true' : 'false'}
						/>
					</div>

					<div className={formGroup}>
						<label htmlFor='password'>Пароль:</label>
						<input
							type='password'
							id='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							required
							aria-required='true'
							aria-invalid={
								error && error.includes('password') ? 'true' : 'false'
							}
						/>
					</div>

					<Link to={'/request-password'}>
						<button>Забыли пароль?</button>
					</Link>

					<button type='submit' disabled={isLoading} className={submitButton}>
						{isLoading ? 'Выполняется...' : 'Войти'}
					</button>
				</form>
			</div>
		</div>
	)
}
