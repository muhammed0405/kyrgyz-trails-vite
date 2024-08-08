/** @format */
"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"

export default function Restaurants() {
	const [tours, setTours] = useState([])
	const [error, setError] = useState(null)
	function generateCode(): string {
		const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
		const segments = [4, 3, 4, 4, 3]

		const generateSegment = (length: number): string => {
			return Array.from(
				{ length },
				() => chars[Math.floor(Math.random() * chars.length)]
			).join("")
		}

		const code = segments.map(generateSegment).join("-")
		return "BIKE-" + code
	}

	// Usage
	console.log(generateCode())
	function generateCSRFToken(): string {
		const characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		let token = ""
		for (let i = 0; i < 32; i++) {
			token += characters.charAt(Math.floor(Math.random() * characters.length))
		}
		return token
	}

	const getTours = async () => {
		const csrfToken = generateCSRFToken()
		try {
			console.log("Generated CSRF token:", csrfToken)
			const url = "http://127.0.0.1:8090/api/tours"
			const response = await axios.get(url, {
				headers: {
					"X-CSRFToken": csrfToken,
				},
			})
			console.log("Data fetched successfully:", response.data)
			setTours(response.data)
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error("Error details:", error.response?.data)
				if (error.response?.status === 500) {
					setError("Server error. Please try again later or contact support.")
				} else if (error.response?.status === 403) {
					setError(
						"Access forbidden. CSRF token might not be accepted by the server."
					)
				} else {
					setError(`An error occurred: ${error.message}`)
				}
			} else {
				console.error("An unexpected error occurred:", error)
				setError("An unexpected error occurred. Please try again.")
			}
		}
	}

	useEffect(() => {
		getTours()
	}, []) // Empty dependency array means this effect runs once on mount

	return (
		<div>
			<h1>Restaurants</h1>
			{error && <p>Error: {error}</p>}
			{tours.length > 0 ? (
				<ul>
					{tours.map((tour, index) => (
						<li key={index}>{JSON.stringify(tour)}</li>
					))}
				</ul>
			) : (
				<p>No tours available</p>
			)}
		</div>
	)
}
