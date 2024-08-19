/** @format */

import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRouteAdmin = () => {
	const isAdmin = JSON.parse(
		localStorage.getItem('pocketbase_auth') || '{}'
	)?.role === 'admin'

	if (!isAdmin) {
		return <Navigate to='/auth/login_user' replace />
	}

	// if (!authData.userId) {
	// 	return <Navigate to="/verify-email" replace />
	// }

	return <Outlet />
}

export default ProtectedRouteAdmin
