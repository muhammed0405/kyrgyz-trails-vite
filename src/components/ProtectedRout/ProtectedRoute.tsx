/** @format */

import { useTypedSelectorHook } from "../../Redux/customHooks/useTypedSelectorHook"
import { Navigate, Outlet } from "react-router-dom"

const ProtectedRoute = () => {
	const { isLoggedIn, isAuth } = useTypedSelectorHook(state => state.auth)

	const authData = localStorage.getItem("pocketbase_auth")

	// if (!authData.userId) {
	// 	return <Navigate to="/auth/login_user" replace />
	// }

	// if (!authData.userId) {
	// 	return <Navigate to="/verify-email" replace />
	// }

	return <Outlet />
}

export default ProtectedRoute
