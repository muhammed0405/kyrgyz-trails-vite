/** @format */

import pb from "../../assets/lib/pocketbase"
import { useForm } from "react-hook-form"
import useLogout from "../hooks/useLogout"
import useLogin from "../hooks/useLogin"
export default function AuthSecond() {
	const logout = useLogout()
	const { register, handleSubmit, reset } = useForm()
	const { mutate: login, isLoading, isError } = useLogin()
	const isLoggedIn = pb.authStore.isValid
	function onSubmit(data: { email: string; password: string }) {
		console.log(data)
		login({ email: data.email, password: data.password })

		reset()
	}

	if (isLoggedIn) {
		return (
			<>
				<h1>Logged in: {pb.authStore.model?.email}</h1>
				<button onClick={logout}>Logout</button>
			</>
		)
	}
	return (
		<>
			{isLoading && <p>Loading...</p>}
			{isError && <p style={{ color: "red" }}>Error</p>}
			<h1>Logged In: {isLoggedIn && pb.authStore.model?.email}</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<input
					id="email"
					type="text"
					placeholder="email"
					{...register("email")}
				/>
				<input
					id="password"
					type="password"
					placeholder="password"
					{...register("password")}
				/>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Loading" : "Login"}
				</button>
			</form>
		</>
	)
}
