/** @format */

import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import styles from "../../styles/formStyles.module.scss"

export default function AddTour() {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [image, setImage] = useState<File | null>(null)
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

		// Включаем возможность редактирования для div
		if (editorRef.current) {
			editorRef.current.contentEditable = "true"
		}
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError("")

		try {
			const formData = new FormData()
			formData.append("title", title)
			formData.append("description", editorRef.current?.innerHTML || "")
			if (image) {
				formData.append("image", image)
			}

			const response = await axios.post(
				"https://kyrgyz-tra.pockethost.io/api/collections/locations/records",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)

			console.log("Data sent successfully:", response.data)
			// Reset form or redirect user as needed
			setTitle("")
			if (editorRef.current) {
				editorRef.current.innerHTML = ""
			}
			setImage(null)
		} catch (err) {
			console.error("Error sending data:", err)
			setError("Failed to send data. Please try again.")
		}
	}

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImage(e.target.files[0])
		}
	}

	const handleBoldClick = () => {
		document.execCommand("bold", false)
	}

	const handleItalicClick = () => {
		document.execCommand("italic", false)
	}

	const handleUnderlineClick = () => {
		document.execCommand("underline", false)
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
						className={styles.input}
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
					<div className={styles.editorToolbar}>
						<button type="button" onClick={handleBoldClick}>
							B
						</button>
						<button type="button" onClick={handleItalicClick}>
							I
						</button>
						<button type="button" onClick={handleUnderlineClick}>
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
						}}
					/>
				</div>
				<div className={styles.inputGroup}>
					<input
						type="file"
						id="image"
						className={styles.input}
						onChange={handleImageChange}
						required
						placeholder=" "
					/>
					<label htmlFor="image" className={styles.label}>
						Изображение
					</label>
				</div>
				<button type="submit" className={styles.submitButton}>
					Создать
				</button>
			</form>
		</div>
	)
}
