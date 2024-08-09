/** @format */

import React from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"

type FormInputs = {
	username: string
	email: string
	password: string
	passwordConfirm: string
}

const RegisterPage: React.FC = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormInputs>()
	const navigate = useNavigate()

	const onSubmit = async (data: FormInputs) => {
		try {
			const response = await axios.post(
				"https://travel-t7k4.onrender.com/accounts/signup/",
				data,
				{
					withCredentials: true,
				}
			)
			console.log("Registration successful:", response.data)
			navigate("/auth/login_user")
		} catch (error) {
			console.error("Error registering user:", error)
		}
	}
	return (
		<div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
				<h2 className={styles.title}>Registration</h2>
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="username"
						className={styles.input}
						{...register("username", { required: "Username is required" })}
						placeholder=" "
					/>
					<label htmlFor="username" className={styles.label}>
						Username
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
							required: "Email is required",
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Invalid email format",
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="email" className={styles.label}>
						Email
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
							required: "Password is required",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters",
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="password" className={styles.label}>
						Password
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
							required: "Password confirmation is required",
							validate: (val: string) => {
								if (watch("password") !== val) {
									return "Passwords do not match"
								}
							},
						})}
						placeholder=" "
					/>
					<label htmlFor="passwordConfirm" className={styles.label}>
						Confirm Password
					</label>
					{errors.passwordConfirm && (
						<span className={styles.error}>
							{errors.passwordConfirm.message}
						</span>
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
