/** @format */
"use client"
import axios from "axios"
import React, { useEffect, useState } from "react"

const TourForm = () => {
	const [formData, setFormData] = useState({
		location: {
			name: "",
			image: null,
			content: "",
		},
		guide: {},
		description: {
			people: null,
			activityLevel: "",
			comfortLevel: "",
			languages: null,
			journey: "",
		},
		itinerary: {
			place: "",
			description: "",
			images: null,
		},
		place_to_live: {
			description: "",
			images: null,
		},
		title: "",
		images: null,
		included: "",
		not_included: "",
		price: null,
		steps: null,
	})

	const handleChange = e => {
		const { name, value, type, files } = e.target
		if (name.includes(".")) {
			const [section, field] = name.split(".")
			setFormData(prevState => ({
				...prevState,
				[section]: {
					...prevState[section],
					[field]: type === "file" ? files[0] : value,
				},
			}))
		} else {
			setFormData(prevState => ({
				...prevState,
				[name]: type === "file" ? files[0] : value,
			}))
		}
	}

	const handleSubmit = async e => {
		e.preventDefault()

		const formDataToSend = new FormData()

		// Негизги талаалар
		formDataToSend.append("title", formData.title)
		formDataToSend.append("included", formData.included)
		formDataToSend.append("not_included", formData.not_included)
		formDataToSend.append("price", formData.price)
		formDataToSend.append("steps", formData.steps)

		// Негизги сүрөт
		if (formData.images) {
			formDataToSend.append("images", formData.images)
		}

		// Локация
		formDataToSend.append("location.name", formData.location.name)
		formDataToSend.append("location.content", formData.location.content)
		if (formData.location.image) {
			formDataToSend.append("location.image", formData.location.image)
		}

		// Гид
		if (formData.guide.id) {
			formDataToSend.append("guide", formData.guide.id)
		}

		// Сүрөттөмө
		formDataToSend.append("description.people", formData.description.people)
		formDataToSend.append(
			"description.activityLevel",
			formData.description.activityLevel
		)
		formDataToSend.append(
			"description.comfortLevel",
			formData.description.comfortLevel
		)
		formDataToSend.append(
			"description.languages",
			formData.description.languages
		)
		formDataToSend.append("description.journey", formData.description.journey)

		// Маршрут
		formDataToSend.append("itinerary.place", formData.itinerary.place)
		formDataToSend.append(
			"itinerary.description",
			formData.itinerary.description
		)
		if (formData.itinerary.images) {
			formDataToSend.append("itinerary.images", formData.itinerary.images)
		}

		// Жашоо жери
		formDataToSend.append(
			"place_to_live.description",
			formData.place_to_live.description
		)
		if (formData.place_to_live.images) {
			formDataToSend.append(
				"place_to_live.images",
				formData.place_to_live.images
			)
		}

		try {
			const username = "admin"
			const password = "1"
			const headers = new Headers({
				Authorization: "Basic " + btoa(username + ":" + password),
			})

			const response = await fetch("http://127.0.0.1:8000/api/tours/", {
				method: "POST",
				body: formDataToSend,
				credentials: "include", // If using cookies
				headers: headers,
			})

			if (!response.ok) {
				throw new Error("Network response was not ok")
			}

			const result = await response.json()
			console.log("Success:", result)
		} catch (error) {
			console.error("Error:", error)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="text"
				name="title"
				value={formData.title}
				onChange={handleChange}
				placeholder="Title"
			/>
			<input type="file" name="images" onChange={handleChange} />
			<input
				type="text"
				name="included"
				value={formData.included}
				onChange={handleChange}
				placeholder="Included"
			/>
			<input
				type="text"
				name="not_included"
				value={formData.not_included}
				onChange={handleChange}
				placeholder="Not Included"
			/>
			<input
				type="number"
				name="price"
				value={formData.price || ""}
				onChange={handleChange}
				placeholder="Price"
			/>
			<input
				type="number"
				name="steps"
				value={formData.steps || ""}
				onChange={handleChange}
				placeholder="Steps"
			/>

			<h3>Location</h3>
			<input
				type="text"
				name="location.name"
				value={formData.location.name}
				onChange={handleChange}
				placeholder="Location Name"
			/>
			<input type="file" name="location.image" onChange={handleChange} />
			<textarea
				name="location.content"
				value={formData.location.content}
				onChange={handleChange}
				placeholder="Location Content"
			/>

			<h3>Description</h3>
			<input
				type="number"
				name="description.people"
				value={formData.description.people || ""}
				onChange={handleChange}
				placeholder="Number of People"
			/>
			<input
				type="text"
				name="description.activityLevel"
				value={formData.description.activityLevel}
				onChange={handleChange}
				placeholder="Activity Level"
			/>
			<input
				type="text"
				name="description.comfortLevel"
				value={formData.description.comfortLevel}
				onChange={handleChange}
				placeholder="Comfort Level"
			/>
			<input
				type="text"
				name="description.languages"
				value={formData.description.languages || ""}
				onChange={handleChange}
				placeholder="Languages"
			/>
			<textarea
				name="description.journey"
				value={formData.description.journey}
				onChange={handleChange}
				placeholder="Journey Description"
			/>

			<h3>Itinerary</h3>
			<input
				type="text"
				name="itinerary.place"
				value={formData.itinerary.place}
				onChange={handleChange}
				placeholder="Itinerary Place"
			/>
			<textarea
				name="itinerary.description"
				value={formData.itinerary.description}
				onChange={handleChange}
				placeholder="Itinerary Description"
			/>
			<input type="file" name="itinerary.images" onChange={handleChange} />

			<h3>Place to Live</h3>
			<textarea
				name="place_to_live.description"
				value={formData.place_to_live.description}
				onChange={handleChange}
				placeholder="Place to Live Description"
			/>
			<input type="file" name="place_to_live.images" onChange={handleChange} />

			<button type="submit">Submit</button>
		</form>
	)
}

export default TourForm
