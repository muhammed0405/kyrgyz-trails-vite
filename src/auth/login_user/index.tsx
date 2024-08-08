/** @format */
"use client"
import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import styles from "../../styles/formStyles.module.scss"
import axios from "axios"

export default function Login() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

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

		const getRegions = async () => {
			try {
				const url = "http://127.0.0.1:8000/api/location"
				const response = await axios.get(url, {
					auth: {
						username: "admin",
						password: "1",
					},
					withCredentials: true,
				})
				console.log("Data fetched successfully:", response.data)
			} catch (error) {
				console.error("Error fetching data:", error)
			}
		}

		getRegions()
	}, [])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Login:", { email, password })
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<h2 className={styles.authTitle}>Войти</h2>
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
