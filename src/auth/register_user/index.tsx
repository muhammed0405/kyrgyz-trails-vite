/** @format */

"use client"
import React, { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"

type FormInputs = {
	username: string
	email: string
	password: string
	passwordConfirm: string
	role: string
}

const Register: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
		setError,
	} = useForm<FormInputs>()
	const navigate = useNavigate()
	const [serverError, setServerError] = useState<string | null>(null)

	const onSubmit: SubmitHandler<FormInputs> = async data => {
		setServerError(null)
		try {
			const response = await axios.post(
				"http://127.0.0.1:8090/api/collections/users/records",
				{
					username: data.username,
					email: data.email,
					password: data.password,
					passwordConfirm: data.passwordConfirm,
					role: data.role,
				}
			)
			console.log("Registration successful:", response.data)
			navigate("/auth/login_user")
		} catch (error) {
			console.error("Error registering user:", error)
			if (error.response && error.response.data && error.response.data.data) {
				const serverErrors = error.response.data.data
				Object.keys(serverErrors).forEach(key => {
					setError(key as keyof FormInputs, {
						type: "server",
						message: serverErrors[key].message,
					})
				})
			} else {
				setServerError("An unexpected error occurred. Please try again.")
			}
		}
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
				<h2 className={styles.authTitle}>Регистрация</h2>
				{serverError && <div className={styles.serverError}>{serverError}</div>}
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="username"
						className={styles.input}
						{...register("username", {
							required: "Имя пользователя обязательно",
						})}
						placeholder=" "
					/>
					<label htmlFor="username" className={styles.label}>
						Имя пользователя
					</label>
					{errors.username && (
						<span className={styles.error}>{errors.username.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<input
						type="email"
						id="email"
						className={styles.input}
						{...register("email", {
							required: "Email обязателен",
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Неверный формат email",
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="email" className={styles.label}>
						Электронная почта
					</label>
					{errors.email && (
						<span className={styles.error}>{errors.email.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<input
						type="password"
						id="password"
						className={styles.input}
						{...register("password", {
							required: "Пароль обязателен",
							minLength: {
								value: 8,
								message: "Пароль должен содержать минимум 8 символов",
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="password" className={styles.label}>
						Пароль
					</label>
					{errors.password && (
						<span className={styles.error}>{errors.password.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<input
						type="password"
						id="passwordConfirm"
						className={styles.input}
						{...register("passwordConfirm", {
							required: "Подтверждение пароля обязательно",
							validate: (val: string) => {
								if (watch("password") != val) {
									return "Пароли не совпадают"
								}
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="passwordConfirm" className={styles.label}>
						Подтвердите пароль
					</label>
					{errors.passwordConfirm && (
						<span className={styles.error}>
							{errors.passwordConfirm.message}
						</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="role"
						className={styles.input}
						{...register("role", { required: "Роль обязательна" })}
						placeholder=" "
					/>
					<label htmlFor="role" className={styles.label}>
						Роль
					</label>
					{errors.role && (
						<span className={styles.error}>{errors.role.message}</span>
					)}
				</div>
				<button type="submit" className={styles.submitButton}>
					Регистрация
				</button>
				<Link to="/auth/login" className={styles.switchLink}>
					Уже есть аккаунт? Войти
				</Link>
			</form>
		</div>
	)
}

export default Register
