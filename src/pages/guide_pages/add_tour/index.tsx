/** @format */

import React, { useState, useEffect, useRef } from "react"
import PocketBase from "pocketbase"
import styles from "../../../styles/formStyles.module.scss"
import { join } from 'path'
import { json } from 'stream/consumers'

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
const UserId =JSON.parse(localStorage.getItem("pocketbase_auth")).userId 
		try {
			const formData = new FormData()
			formData.append("guide_id",UserId)
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

	const handleEditorCommand = (command: string) => {
		document.execCommand(command, false)
	}

	return (
		<div className={styles.authContainer}>
			<form className={styles.authForm} onSubmit={handleSubmit}>
				<h2 className={styles.authTitle}>Создать локацию</h2>
				{error && <p className={styles.errorMessage}>{error}</p>}
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="title"
						className={styles.addTourInput}
						value={title}
						onChange={e => setTitle(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="title" className={styles.label}>
						Название
					</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="text"
						id="location"
						className={styles.addTourInput}
						value={location}
						onChange={e => setLocation(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="location" className={styles.label}>
						Местоположение
					</label>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="number"
						id="price"
						className={styles.addTourInput}
						value={price}
						onChange={e => setPrice(e.target.value)}
						required
						placeholder=" "
					/>
					<label htmlFor="price" className={styles.label}>
						Цена
					</label>
				</div>
				<div className={styles.inputGroup}>
					<div className={styles.editorToolbar}>
						<button type="button" onClick={() => handleEditorCommand("bold")}>
							B
						</button>
						<button type="button" onClick={() => handleEditorCommand("italic")}>
							I
						</button>
						<button
							type="button"
							onClick={() => handleEditorCommand("underline")}
						>
							U
						</button>
					</div>
					<div
						ref={editorRef}
						className={styles.editor}
						style={{
							border: "1px solid #ccc",
							minHeight: "100px",
							padding: "10px",
							marginBottom: "10px",
							whiteSpace: "pre-wrap",
						}}
					/>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="file"
						id="images"
						className={styles.addTourInput}
						onChange={handleImageChange}
						required
						multiple
						accept="image/*"
						placeholder=" "
					/>
					<label htmlFor="images" className={styles.label}>
						Изображения
					</label>
				</div>
				<button type="submit" className={styles.submitButton}>
					Создать
				</button>
			</form>
		</div>
	)
}
