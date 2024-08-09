/** @format */

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const navigate = useNavigate()

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		try {
			const url = "http://127.0.0.1:8090/api/collections/users/records"
			const response = await axios.post(url, { email, password })

			// Assuming the response contains the user data and token
			const { token, user } = response.data

			// Store the token and user role in localStorage or in your state management
			localStorage.setItem("authToken", token)
			localStorage.setItem("userRole", user.role)

			// Redirect to a protected page or show a success message
			navigate("/dashboard")
		} catch (error) {
			console.error("Login failed:", error)
			setError("Invalid email or password")
		}
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<h2 className={styles.authTitle}>Войти</h2>
				{error && <p className={styles.errorMessage}>{error}</p>}
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
				<button type="submit" className={styles.submitButton}>
					Войти
				</button>
				<Link to="/auth/register_user" className={styles.switchLink}>
					Нет аккаунта? Регистрация
				</Link>
			</form>
		</div>
	)
}
