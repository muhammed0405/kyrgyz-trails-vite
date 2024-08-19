import React from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface CustomToastProps {
	position?:
		| 'top-right'
		| 'top-center'
		| 'top-left'
		| 'bottom-right'
		| 'bottom-center'
		| 'bottom-left'
}

const CustomToast: React.FC<CustomToastProps> = ({
	position = 'top-right',
}) => {
	return (
		<ToastContainer
			position={position}
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover
		/>
	)
}

export const showErrorToast = (message: string) => {
	toast.error(message, {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		style: { backgroundColor: '#FF6B6B', color: 'white' },
	})
}

export const showSuccessToast = (message: string) => {
	toast.success(message, {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		style: { backgroundColor: '#4CAF50', color: 'white' },
	})
}

export default CustomToast
