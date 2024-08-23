/** @format */

import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { UseTypedDispatch } from '../../Redux/customHooks/useTypedDispatch'

import { useTypedSelectorHook } from '../../Redux/customHooks/useTypedSelectorHook'

interface FormData {
	username: string

	email: string

	emailVisibility: boolean

	password: string

	passwordConfirm: string

	role: 'admin' | 'user' | 'guide'
	resume?: string
}

interface FormErrors {
	username?: string
	email?: string
	password?: string
	passwordConfirm?: string
}

export default function RegisterPages() {
	const navigate = useNavigate()

	const { registerUser } = UseTypedDispatch()

	const { isLoading, error } = useTypedSelectorHook((state) => state.auth)

	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	const [formErrors, setFormErrors] = useState<FormErrors>({})

	const [formData, setFormData] = useState<FormData>({
		username: '',
		email: '',
		emailVisibility: true,
		password: '',
		passwordConfirm: '',
		role: 'user',
	})

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target

		setFormData((prevData) => ({
			...prevData,

			[name]: value,
		}))
	}

	const validateForm = (): boolean => {
		const errors: FormErrors = {}

		if (!formData.username.trim()) {
			errors.username = 'Username is required'
		}

		if (!formData.email.trim()) {
			errors.email = 'Почта обязательна'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email =
				'Пожалуйста, введите действительный адрес электронной почты'
		}

		if (!formData.password) {
			errors.password = 'Пароль обязателен'
		} else if (formData.password.length < 8) {
			errors.password = 'Пароль должен содержать как минимум 8 символов'
		} else if (!/[A-Z]/.test(formData.password)) {
			errors.password =
				'Пароль должен содержать как минимум одну заглавную букву'
		} else if (!/[a-z]/.test(formData.password)) {
			errors.password =
				'Пароль должен содержать как минимум одну строчную букву'
		} else if (!/[0-9]/.test(formData.password)) {
			errors.password = 'Password must contain at least one digit'
		} else if (!/[!@#\$%\^\&*\)\(+=._-]/.test(formData.password)) {
			errors.password = 'Пароль должен содержать как минимум один спец. символ'
		}

		if (formData.password !== formData.passwordConfirm) {
			errors.passwordConfirm = 'Passwords do not match'
		}

		setFormErrors(errors)
		return Object.keys(errors).length === 0
	}

	// В вашем компоненте регистрации
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!validateForm()) {
			return
		}

		const result = await registerUser(formData)

		if (result.success) {
			navigate(`/verify-email/`)
		}
	}

	useEffect(() => {
		validateForm()
	}, [formData])
	return (
		<div className={authContainer}>
			<form className={authForm} onSubmit={handleSubmit}>
				<h1 className={authTitle}>Регистрация Sawerty2005/@</h1>

				{error && <p className={errorMessage}>{error}</p>}

				{successMessage && <p className={successMessage}>{successMessage}</p>}

				<div className={inputGroup}>
					<input
						type='text'
						name='username'
						className={input}
						value={formData.username}
						onChange={handleChange}
						required
						placeholder=' '
					/>
					<label className={label}>Имя</label>
					{formErrors.username && (
						<span className={fieldError}>{formErrors.username}</span>
					)}
				</div>

				<div className={inputGroup}>
					<input
						type='email'
						name='email'
						className={input}
						value={formData.email}
						onChange={handleChange}
						required
						placeholder=' '
					/>
					<label className={label}>Почта</label>
					{formErrors.email && (
						<span className={fieldError}>{formErrors.email}</span>
					)}
				</div>

				<div className={inputGroup}>
					<input
						type='password'
						name='password'
						className={input}
						value={formData.password}
						onChange={handleChange}
						required
						placeholder=' '
					/>
					<label className={label}>Пароль</label>
					{formErrors.password && (
						<span className={fieldError}>{formErrors.password}</span>
					)}
				</div>

				<div className={inputGroup}>
					<input
						type='password'
						name='passwordConfirm'
						className={input}
						value={formData.passwordConfirm}
						onChange={handleChange}
						required
						placeholder=' '
					/>
					<label className={label}>Подтвердите пароль</label>
					{formErrors.passwordConfirm && (
						<span className={fieldError}>{formErrors.passwordConfirm}</span>
					)}
				</div>

				<div className={inputGroup}>
					<select
						name='role'
						className={roleSelect}
						value={formData.role}
						onChange={handleChange}
					>
						<option value='admin'>Админ</option>
						<option value='user'>Пользователь</option>
						<option value='guide'>Гид</option>
					</select>
					<label className={label_role}>Роль</label>
				</div>

				<button type='submit' className={submitButton} disabled={isLoading}>
					{isLoading ? 'Регистрируемся...' : 'Регистрация'}
				</button>
			</form>
		</div>
	)
}
