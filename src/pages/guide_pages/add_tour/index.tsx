/** @format */

import CustomToast, {
	showErrorToast,
	showSuccessToast,
} from "@/components/common/toaster/customToast"
import PocketBase from "pocketbase"
import React, { useEffect, useRef, useState } from "react"
import "@/styles/formStyles.scss"
const pb = new PocketBase("https://kyrgyz-tra.pockethost.io")

export default function AddTour() {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [location, setLocation] = useState("")
	const [price, setPrice] = useState("")
	const [images, setImages] = useState<File[]>([])
	const [error, setError] = useState("")
	const editorRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const labels = document.querySelectorAll(`.${"label"}`)
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
		if (editorRef.current) {
			editorRef.current.contentEditable = "true"
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		if (images.length === 0) {
			setError("Please select at least one image")
			return
		}
		const UserId = JSON.parse(localStorage.getItem("pocketbase_auth")).userId
		try {
			const formData = new FormData()
			formData.append("guide_id", UserId)
			formData.append("title", title)
			formData.append("description", editorRef.current?.innerHTML || "")
			formData.append("location", location)
			formData.append("price", price)

			// Append each image to the FormData
			images.forEach(image => {
				formData.append(`images`, image, image.name)
			})

			// Log all form data
			for (let [key, value] of formData.entries()) {
				console.log(`${key}:`, value)
			}

			const record = await pb.collection("tours").create(formData)

			console.log("Tour created successfully:", record)
			console.log("Created record ID:", record.id)

			// Verify if the images were uploaded
			if (record.images && record.images.length > 0) {
				record.images.forEach((image: string, index: number) => {
					console.log(`Image ${index + 1} URL:`, pb.getFileUrl(record, image))
				})
			} else {
				console.log("No images were saved with the record")
			}
			showSuccessToast("Тур успешно создан")

			// Reset form
			setTitle("")
			setLocation("")
			setPrice("")
			setImages([])
			if (editorRef.current) {
				editorRef.current.innerHTML = ""
			}
		} catch (err: any) {
			console.error("Error creating tour:", err)
			if (err.data && err.data.data) {
				console.log("Detailed error:", JSON.stringify(err.data.data, null, 2))
			}
			showErrorToast("Ошибка при создании тура")
			setError("Failed to create tour. Please check console for details.")
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const selectedImages = Array.from(e.target.files)
			console.log("Images selected:", selectedImages)
			selectedImages.forEach((image, index) => {
				console.log(`Image ${index + 1} name:`, image.name)
				console.log(`Image ${index + 1} type:`, image.type)
				console.log(`Image ${index + 1} size:`, image.size, "bytes")
			})
			setImages(selectedImages)
		}
	}

	return (
		<div className={"authContainer"}>
			<form className={"authForm"} onSubmit={handleSubmit}>
				<h2 className={"authTitle"}>Создать локацию</h2>
				{error && <p className={"errorMessage"}>{error}</p>}
				<div className={"inputGroup"}>
					<input
						type="text"
						id="title"
						className={"input"}
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="title" className={"label"}>
						Название
					</label>
				</div>
				<div className={"inputGroup"}>
					<input
						type="text"
						id="location"
						className={"input"}
						value={location}
						onChange={e => setLocation(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="location" className={"label"}>
						Местоположение
					</label>
				</div>
				<div className={"inputGroup"}>
					<input
						type="number"
						id="price"
						className={"input"}
						value={price}
						onChange={e => setPrice(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="price" className={"label"}>
						Цена
					</label>
				</div>
				<div className={"inputGroup"}>
					<div
						ref={editorRef}
						className={"editor"}
						style={{
							border: "1px solid #ccc",
							minHeight: "100px",
							padding: "10px",
							marginBottom: "10px",
							whiteSpace: "pre-wrap",
						}}
					/>
				</div>
				<div className={"inputGroup"}>
					<input
						type="file"
						id="images"
						className={"input"}
						onChange={handleImageChange}
						required
						multiple
						accept="image/*"
						placeholder=" "
					/>
					<label htmlFor="images" className={"label"}>
						Изображения
					</label>
				</div>
				<button type="submit" className={"submitButton"}>
					Создать
				</button>
			</form>
			<CustomToast />
		</div>
	)
}
