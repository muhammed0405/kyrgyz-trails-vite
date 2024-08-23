/** @format */
'use client'
import React, { useEffect, useState } from 'react'

export default function GuideRegister() {
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [resume, setResume] = useState<File | null>(null)
	const [showEmailSent, setShowEmailSent] = useState(false)

	useEffect(() => {
		const labels = document.querySelectorAll(`.${label}`)
		labels.forEach((label) => {
			const text = (label as HTMLElement).innerText
			label.innerHTML = text
				.split('')
				.map(
					(letter: string, idx: number) =>
						`<span style="transition-delay:${idx * 50}ms">${letter}</span>`
				)
				.join('')
		})
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log('Guide Register:', {
			firstName,
			lastName,
			email,
			password,
			resume,
		})
		setShowEmailSent(true)
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setResume(e.target.files[0])
		}
	}

	return (
		<div className={authContainer}>
			<form className={authForm} onSubmit={handleSubmit}>
				<h2 className={authTitle}>Регистрация Гида </h2>
				<div className={inputGroup}>
					<input
						type='text'
						id='firstName'
						className={input}
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
						placeholder=' '
					/>
					<label htmlFor='firstName' className={label}>
						Имя
					</label>
				</div>
				<div className={inputGroup}>
					<input
						type='text'
						id='lastName'
						className={input}
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
						placeholder=' '
					/>
					<label htmlFor='lastName' className={label}>
						Фамилия
					</label>
				</div>
				<div className={inputGroup}>
					<input
						type='email'
						id='email'
						className={input}
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						placeholder=' '
					/>
					<label htmlFor='email' className={label}>
						Электронная почта
					</label>
				</div>
				<div className={inputGroup}>
					<input
						type='password'
						id='password'
						className={input}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						placeholder=' '
					/>
					<label htmlFor='password' className={label}>
						Пароль
					</label>
				</div>
				<div className={inputGroup}>
					<label htmlFor='resume' className={fileLabel}>
						Resume (PDF)
					</label>
					<input
						type='file'
						id='resume'
						className={fileInput}
						onChange={handleFileChange}
						accept='.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
						required
					/>
				</div>
				<button type='submit' className={submitButton}>
					Зарегистрироваться как Гид
				</button>
				{showEmailSent && (
					<div className={successMessage}>
						Registration successful! Please check your email for a verification
						code.
					</div>
				)}
			</form>
		</div>
	)
}
