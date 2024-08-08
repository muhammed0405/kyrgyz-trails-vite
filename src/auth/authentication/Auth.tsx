/** @format */
// import { useEffect } from "react"
import { useState } from "react"
import { pb } from "../../assets/lib/pocketbase"
import { useForm } from "react-hook-form"
export default function Auth() {
	const [isLoading, setIsLoading] = useState(false)
	const { register, handleSubmit } = useForm()
	console.log(register("email"))

	async function login(data) {
		setIsLoading(true)

		try {
			const authData = await pb
				.collection("users")
				.authWithPassword(data.username, data.password)

			console.log("pb.authStore.isValid", pb.authStore.isValid)
			console.log("pb.authStore.token", pb.authStore.token)
			console.log("pb.authStore.model.id", pb.authStore.model.id)
			setIsLoading(false)
		} catch (error) {
			console.log("error", error)
		}
		console.log("data", data)
	}

	// // "logout" the last authenticated model
	// pb.authStore.clear()
	return (
		<div>
			<h1>Logged in: {pb.authStore.isValid.toString()}</h1>
			{isLoading && <p>Loading...</p>}
			<form onSubmit={handleSubmit(login)}>
				<input type="text" id="username" {...register("username")} />
				<input type="password" id="password" {...register("password")} />
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Loading..." : "Login"}
				</button>
			</form>
		</div>
	)
}
