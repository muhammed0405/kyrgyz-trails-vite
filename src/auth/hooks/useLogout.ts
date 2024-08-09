/** @format */
import { useState } from "react"
import pb from "../../assets/lib/pocketbase"
export default function useLogout() {
	const [dummy, setDummy] = useState(0)
	function logout() {
		pb.authStore.clear()
		setDummy(Math.random())
	}
	return logout
}
