/** @format */

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import PocketBase from "pocketbase"
import "@/styles/update_tour.scss"

const pb = new PocketBase("https://kyrgyz-tra.pockethost.io")

interface TourData {
	title: string
	description: string
	location: string
	price: string
	images: string[]
}

function htmlToPlainText(html: string): string {
	let text = html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/div>/gi, "\n")

	text = text.replace(/<[^>]+>/g, "")

	text = text
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")

	text = text.replace(/\n{3,}/g, "\n\n").trim()

	return text
}

export default function UpdateTour(): JSX.Element {
	const { tourId } = useParams<{ tourId: string }>()
	const navigate = useNavigate()
	const [title, setTitle] = useState<string>("")
	const [description, setDescription] = useState<string>("")
	const [location, setLocation] = useState<string>("")
	const [price, setPrice] = useState<string>("")
	const [images, setImages] = useState<File[]>([])
	const [error, setError] = useState<string>("")

	useEffect(() => {
		const fetchTourData = async (): Promise<void> => {
			try {
				if (!tourId) throw new Error("Tour ID is undefined")
				const record = await pb.collection("tours").getOne<TourData>(tourId)
				setTitle(record.title)
				setDescription(htmlToPlainText(record.description))
				setLocation(record.location)
				setPrice(record.price)
			} catch (err) {
				console.error("Error fetching tour data:", err)
				setError("Failed to fetch tour data")
			}
		}

		fetchTourData()
	}, [tourId])

	const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault()
		setError("")

		try {
			if (!tourId) throw new Error("Tour ID is undefined")

			const formData = new FormData()
			formData.append("title", title)
			formData.append("description", description)
			formData.append("location", location)
			formData.append("price", price)

			images.forEach(image => {
				formData.append(`images`, image, image.name)
			})

			const authData = localStorage.getItem("pocketbase_auth")
			const userId = authData ? JSON.parse(authData).userId : null
			if (userId) formData.append("guide_id", userId)

			const record = await pb
				.collection("tours")
				.update<TourData>(tourId, formData)

			console.log("Tour updated successfully:", record)
			navigate("/my_tours")
		} catch (err: unknown) {
			console.error("Error updating tour:", err)
			if (err instanceof Error && "data" in err) {
				const errorData = (err as { data?: { data?: unknown } }).data
				if (errorData && typeof errorData === "object" && "data" in errorData) {
					console.log(
						"Detailed error:",
						JSON.stringify(errorData.data, null, 2)
					)
				}
			}
			setError("Failed to update tour. Please check console for details.")
		}
	}

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
		if (e.target.files) {
			const selectedImages = Array.from(e.target.files)
			setImages(selectedImages)
		}
	}

	return (
		<div className={"update__tour__container"}>
			<form className={"update__tour"} onSubmit={handleSubmit}>
				<h2 className={"update__tour__title"}>Обновить тур</h2>
				{error && <p className={"update__tour__error"}>{error}</p>}
				<div className={"update__tour__input__group"}>
					<input
						type="text"
						id="title"
						className={"addTourInput"}
						value={title}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setTitle(e.target.value)
						}
						required
						placeholder=" "
					/>
					<label htmlFor="title" className={"update__tour__label"}>
						Название
					</label>
				</div>
				<div className={"update__tour__input__group"}>
					<input
						type="text"
						id="location"
						className={"addTourInput"}
						value={location}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setLocation(e.target.value)
						}
						required
						placeholder=" "
					/>
					<label
						htmlFor="location"
						className={"update__tour__input__group__label"}
					>
						Местоположение
					</label>
				</div>
				<div className={"update__tour__input__group"}>
					<input
						type="number"
						id="price"
						className={"addTourInput"}
						value={price}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setPrice(e.target.value)
						}
						required
						placeholder=" "
					/>
					<label htmlFor="price" className={"update__tour__label"}>
						Цена
					</label>
				</div>
				<div className={"update__tour__input__group"}>
					<textarea
						id="description"
						className={`${"addTourInput"} ${"preformattedText"}`}
						value={description}
						onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
							setDescription(e.target.value)
						}
						required
						placeholder=" "
						rows={10}
					/>
					<label htmlFor="description" className={"update__tour__label"}>
						Описание
					</label>
				</div>
				<div className={"update__tour__input__group"}>
					<input
						type="file"
						id="images"
						className={"update__tour__input__group__file"}
						onChange={handleImageChange}
						multiple
						accept="image/*"
						placeholder=" "
					/>
					<label
						htmlFor="images"
						className={"update__tour__input__group__label__file"}
					>
						Добавить новые изображения
					</label>
				</div>
				<button type="submit" className={"submitButton"}>
					Обновить
				</button>
			</form>
		</div>
	)
}
