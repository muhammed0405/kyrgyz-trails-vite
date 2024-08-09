/** @format */
import { useMutation } from "react-query"
import pb from "../../assets/lib/pocketbase"

interface loginData {
	email: string
	password: string
}
export default function useLogin() {
	async function login({ email, password }: loginData) {
		const authData = await pb
			.collection("users")
			.authWithPassword(email, password)
	}
	return { login }
}
