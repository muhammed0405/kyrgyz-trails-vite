/** @format */

import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"

export default function Login() {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState("")
	const navigate = useNavigate()

	// Function to get CSRF token
	const getCsrfToken = async () => {
		try {
			const response = await axios.get(
				"http://127.0.0.1:8000/users/csrf_token/",
				{
					withCredentials: true, // Ensure cookies are included in the request
				}
			)
			return response.data.csrfToken // Adjust based on your server's response
		} catch (error) {
			console.error("Failed to get CSRF token:", error)
			setError("Failed to get CSRF token")
		}
	}

	// Handle form submission
	const handleSubmit = async e => {
		e.preventDefault()

		try {
			const csrfToken = await getCsrfToken()

			const url = "http://127.0.0.1:8000/accounts/login/"
			const response = await axios.post(
				url,
				{ username, password },
				{
					headers: {
						"X-CSRFToken": csrfToken,
					},
					withCredentials: true,
					xsrfCookieName: "csrftoken",
					xsrfHeaderName: "X-CSRFToken",
				}
			)
			console.log("Login successful:", response.data)
			// Check if the response contains a location field
			if (response.data.location) {
				// Handle the location field, e.g., navigate to the location
				navigate(response.data)
			} else {
				// Handle unexpected response structure
				setError("Unexpected response from server.")
			}
		} catch (error) {
			console.error("Login failed:", error.response || error)
			if (error.response && error.response.status === 403) {
				setError(
					"CSRF token is incorrect or expired. Please refresh the page and try again."
				)
			} else {
				setError("Неверное имя пользователя или пароль")
			}
		}
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<h2 className={styles.authTitle}>Войти</h2>
				{error && <p className={styles.errorMessage}>{error}</p>}
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="username"
						className={styles.input}
						value={username}
						onChange={e => setUsername(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="username" className={styles.label}>
						Имя пользователя
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
