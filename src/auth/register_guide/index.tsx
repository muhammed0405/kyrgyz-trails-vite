/** @format */
"use client"
import React, { useState, useEffect } from "react"
import styles from "../../styles/formStyles.module.scss"

export default function GuideRegister() {
	const [firstName, setFirstName] = useState("")
	const [lastName, setLastName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [resume, setResume] = useState<File | null>(null)
	const [showEmailSent, setShowEmailSent] = useState(false)

	useEffect(() => {
		const labels = document.querySelectorAll(`.${styles.label}`)
		labels.forEach(label => {
			const text = (label as HTMLElement).innerText
			label.innerHTML = text
				.split("")
				.map(
					(letter: string, idx: number) =>
						`<span style="transition-delay:${idx * 50}ms">${letter}</span>`
				)
				.join("")
		})
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Guide Register:", {
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
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<h2 className={styles.authTitle}>Регистрация Гида </h2>
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="firstName"
						className={styles.input}
						value={firstName}
						onChange={e => setFirstName(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="firstName" className={styles.label}>
						Имя
					</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="lastName"
						className={styles.input}
						value={lastName}
						onChange={e => setLastName(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="lastName" className={styles.label}>
						Фамилия
					</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="email"
						id="email"
						className={styles.input}
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="email" className={styles.label}>
						Электронная почта
					</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="password"
						id="password"
						className={styles.input}
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="password" className={styles.label}>
						Пароль
					</label>
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="resume" className={styles.fileLabel}>
						Resume (PDF)
					</label>
					<input
						type="file"
						id="resume"
						className={styles.fileInput}
						onChange={handleFileChange}
						accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						required
					/>
				</div>
				<button type="submit" className={styles.submitButton}>
					Зарегистрироваться как Гид
				</button>
				{showEmailSent && (
					<div className={styles.successMessage}>
						Registration successful! Please check your email for a verification
						code.
					</div>
				)}
			</form>
		</div>
	)
}
