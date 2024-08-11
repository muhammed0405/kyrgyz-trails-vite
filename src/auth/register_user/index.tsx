/** @format */

import axios from "axios"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import styles from "../../styles/formStyles.module.scss"

function getCookie(name: string): string | null {
	const value = `; ${document.cookie}`
	const parts = value.split(`; ${name}=`)
	if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
	return null
}

type FormInputs = {
	email: string
	username: string
	password1: string
	password2: string
}

const RegisterPage: React.FC = () => {
	const [csrfToken, setCsrfToken] = useState<string | null>(null)
	const [registrationError, setRegistrationError] = useState<string | null>(
		null
	)
	const navigate = useNavigate()
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormInputs>()

	useEffect(() => {
		const fetchCsrfToken = async () => {
			try {
				await axios.get("http://127.0.0.1:8000/users/csrf_token/", {
					withCredentials: true,
				})
				const token = getCookie("csrftoken")
				if (token) {
					setCsrfToken(token)
				} else {
					console.error("CSRF token not found in cookies")
				}
			} catch (error) {
				console.error("Error fetching CSRF token:", error)
			}
		}

		fetchCsrfToken()
	}, [])

	const onSubmit = async (data: FormInputs) => {
		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/users/signup/",
				data,
				{
					headers: {
						"Content-Type": "application/json",
						"X-CSRFToken": csrfToken || "",
					},
					withCredentials: true,
				}
			)
			console.log("Registration successful:", response.data)
			navigate("/auth/login_user")
		} catch (error) {
			console.error("Error registering user:", error)
			setRegistrationError("Registration failed. Please try again.")
		}
	}

	const password = watch("password1")

	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<h2 className={styles.title}>Registration</h2>
				{registrationError && (
					<div className={styles.error}>{registrationError}</div>
				)}
				<div className={styles.inputGroup}>
					<label htmlFor="id_email">E-mail (optional):</label>
					<input
						type="email"
						id="id_email"
						{...register("email", {
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Invalid email format",
							},
						})}
						placeholder="Email Address"
						autoComplete="email"
						maxLength={320}
					/>
					{errors.email && (
						<span className={styles.error}>{errors.email.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="id_username">Username:</label>
					<input
						type="text"
						id="id_username"
						{...register("username", { required: "Username is required" })}
						placeholder="Username"
						autoComplete="username"
						minLength={1}
						maxLength={150}
					/>
					{errors.username && (
						<span className={styles.error}>{errors.username.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="id_password1">Password:</label>
					<input
						type="password"
						id="id_password1"
						{...register("password1", {
							required: "Password is required",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters",
							},
							validate: value => {
								const hasUpperCase = /[A-Z]/.test(value)
								const hasLowerCase = /[a-z]/.test(value)
								const hasNumber = /\d/.test(value)
								const hasSpecialChar =
									/[!@#$%^&*()_+\-=$$$${};':"\\|,.<>/?]+/.test(value)

								if (!hasUpperCase)
									return "Password must contain at least one uppercase letter"
								if (!hasLowerCase)
									return "Password must contain at least one lowercase letter"
								if (!hasNumber)
									return "Password must contain at least one number"
								if (!hasSpecialChar)
									return "Password must contain at least one special character"
								return true
							},
						})}
						placeholder="Password"
						autoComplete="new-password"
					/>
					{errors.password1 && (
						<span className={styles.error}>{errors.password1.message}</span>
					)}
				</div>
				<div className={styles.inputGroup}>
					<label htmlFor="id_password2">Confirm Password:</label>
					<input
						type="password"
						id="id_password2"
						{...register("password2", {
							required: "Password confirmation is required",
							validate: (val: string) =>
								val === password || "Passwords do not match",
						})}
						placeholder="Confirm Password"
						autoComplete="new-password"
					/>
					{errors.password2 && (
						<span className={styles.error}>{errors.password2.message}</span>
					)}
				</div>

				<button type="submit" className={styles.submitButton}>
					Register
				</button>
				<Link to="/auth/login" className={styles.switchLink}>
					Already have an account? Login
				</Link>
			</form>
		</div>
	)
}

export default RegisterPage
