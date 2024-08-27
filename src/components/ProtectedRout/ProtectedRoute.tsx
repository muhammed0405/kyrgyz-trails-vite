/** @format */

import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { Navigate, Outlet } from "react-router-dom"
import { user } from "../userDataOnLocalStorage"
import pb from "@/lib/pocketbase"

const ProtectedRoute = () => {
	const auth = pb.authStore.isValid

	if (!auth) {
		return <Navigate to="/" replace />
	}

	// if (!authData.userId) {
	// 	return <Navigate to="/verify-email" replace />
	// }

	return <Outlet />
}

export default ProtectedRoute
