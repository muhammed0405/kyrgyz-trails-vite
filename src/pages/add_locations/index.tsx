/** @format */
"use client"
import React, { useState } from "react"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"
import { describe } from "node:test"

const LocationForm = () => {
	const [location, setLocation] = useState({
		name: "",
		title: "",
		content: "",
		image: null,
	})

	const tour = [
		{
			id: 2,
			location: [
				{
					name: "Too",
					title: "Sul",
					content: "Suldfkdjfkdjf jkdjf kdj fkdjf",
					images: [
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
					],
				},
			],
			comments: [],
			title: "Ош",
			images: "http://127.0.0.1:8000/media/tours_images/osh.jpg",
			included: "Двух разовый питание",
			not_included: "обед",
			price: "10000.00",
			guide: 2,
			description: {
				people: 19,
				activityLevel: "Низкий",
				comfortLevel: "Низкий",
				language: ["English", "Russian"],
				journey: "Ош",
			},
			itinerary: [
				{
					place: "Ош",
					description: "Ош skdfkdskfjs dkfjs",
					images: [
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
					],
				},
			],
			place_to_live: [
				{
					description: "Ош skdfkdskfjs dkfjs",
					images: [
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
						"http://127.0.0.1:8000/media/tours_images/osh.jpg",
					],
				},
			],
		},
	]

	const handleChange = e => {
		const { name, value } = e.target
		setLocation(prev => ({ ...prev, [name]: value }))
	}

	const handleImageChange = e => {
		setLocation(prev => ({ ...prev, image: e.target.files[0] }))
	}

	const handleSubmit = async e => {
		e.preventDefault()
		const formData = new FormData()
		formData.append("name", location.name)
		formData.append("title", location.title)
		formData.append("content", location.content)
		if (location.image) {
			formData.append("image", location.image)
		}

		const username = "admin" // administrator ulanyjy ady
		const password = "1" // administrator paroly

		try {
			const response = await axios.post(
				"http://127.0.0.1:8000/api/locations/",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
					auth: {
						username: username,
						password: password,
					},
					withCredentials: true,
				}
			)
			console.log("Location added successfully:", response.data)
		} catch (error) {
			console.error("Error adding location:", error)
			if (error.response) {
				console.error("Response data:", error.response.data)
				console.error("Response status:", error.response.status)
				console.error("Response headers:", error.response.headers)
			}
		}
	}

	return (
		<form className={styles.authForm} onSubmit={handleSubmit}>
			<div className={styles.inputGroup}>
				<input
					type="text"
					id="name"
					name="name"
					value={location.name}
					onChange={handleChange}
					required
					className={styles.input}
					placeholder=" "
				/>
				<label htmlFor="name" className={styles.label}>
					<span>Аты:</span>
				</label>
			</div>

			<div className={styles.inputGroup}>
				<input
					type="text"
					id="title"
					name="title"
					value={location.title}
					onChange={handleChange}
					required
					className={styles.input}
					placeholder=" "
				/>
				<label htmlFor="title" className={styles.label}>
					<span>Башкы сөз:</span>
				</label>
			</div>

			<div className={styles.inputGroup}>
				<textarea
					id="content"
					name="content"
					value={location.content}
					onChange={handleChange}
					required
					className={styles.input}
					placeholder=" "
				/>
				<label htmlFor="content" className={styles.label}>
					<span>Мазмуну:</span>
				</label>
			</div>

			<div className={styles.inputGroup}>
				<label htmlFor="image" className={styles.fileLabel}>
					Сүрөт:
				</label>
				<input
					type="file"
					id="image"
					name="image"
					onChange={handleImageChange}
					className={styles.fileInput}
				/>
			</div>

			<button type="submit" className={styles.submitButton}>
				Кошуу
			</button>
		</form>
	)
}

export default LocationForm
