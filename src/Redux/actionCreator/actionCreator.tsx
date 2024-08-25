/** @format */
import axios from 'axios'
import { Dispatch } from 'redux'
import { userActionsTypes } from '../actionTypes/actionTypes'

export const getRegions = () => async (dispatch: Dispatch) => {
	const regionUrl = `${
		import.meta.env.VITE_POCKETBASE_URL
	}/api/collections/locations/records`
	try {
		const response = await axios.get(regionUrl)
		dispatch({
			type: userActionsTypes.GET_LOCATIONS,
			payload: response.data,
		})
		// console.log("Data fetched successfully:", response.data)
	} catch (error) {
		console.error('Error fetching data:', error)
		dispatch({
			type: userActionsTypes.GET_LOCATIONS_ERROR,
			payload: 'Error fetching data. Please try again later.',
		})
	}
}

export const getTours = () => async (dispatch: Dispatch) => {
	try {
		const url = `${
			import.meta.env.VITE_POCKETBASE_URL
		}/api/collections/tours/records`
		const response = await axios.get(url)
		dispatch({
			type: userActionsTypes.GET_USER_TOURS_SUCCESS,
			payload: response.data,
		})
		// console.log("Data fetched successfully tours:", response.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error details:', error.response?.data)
			if (error.response?.status === 403) {
				dispatch({
					type: userActionsTypes.GET_USER_TOURS_ERROR,
					payload: 'Access forbidden. Please try logging in again.',
				})
			} else {
				dispatch({
					type: userActionsTypes.GET_USER_TOURS_ERROR,
					payload: `An error occurred: ${error.message}`,
				})
			}
		} else {
			console.error('An unexpected error occurred:', error)
			dispatch({
				type: userActionsTypes.GET_USER_TOURS_ERROR,
				payload: 'An unexpected error occurred. Please try again.',
			})
		}
	}
}

export const getBookings = () => async (dispatch: Dispatch) => {
	try {
		const response = await pb.collection('booking').getFullList()

		dispatch({
			type: userActionsTypes.GET_USER_BOOKINGS_SUCCESS,
			payload: response,
		})

		console.log('Data fetched successfully:', response)
	} catch (error: any) {
		console.error('Error fetching bookings:', error)

		if (error.status === 401) {
			console.log('You are not authorized to view bookings. Please log in.')
		} else if (error.status === 403) {
			console.log("You don't have permission to view bookings.")
		} else {
			console.log(
				'There was an error fetching bookings. Please try again later.'
			)
		}
	}
}

export const updateBooking = (id, current_state) => {
	return async (dispatch: Dispatch) => {
		const data = {
			current_state: current_state,
		}
		try {
			const response = await pb.collection('booking').update(id, data)
			console.log('Data updated successfully:', response)
			dispatch(getBookings()) // Маалыматтарды жаңыртуу үчүн
		} catch (error) {
			console.error('Error updating data:', error)
		}
	}
}

// authActions.ts
import PocketBase from 'pocketbase'
import { authActionTypes } from '../actionTypes/authActionTypes'
import { IUserType } from '../Interfaces/interFaces'

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

export const registerUser = (userData: IUserType) => {
	return async (dispatch: Dispatch) => {
		dispatch({ type: authActionTypes.REGISTER_REQUEST })

		try {
			console.log('Attempting to create user:', userData)
			const newUser = await pb.collection('users').create(userData)
			console.log('User created successfully:', newUser)

			setTimeout(() => {
				pb.collection('users').requestVerification(userData.email)
			}, 5000)

			dispatch({
				type: authActionTypes.REGISTER_SUCCESS,

				payload: { email: userData.email, password: userData.password },
			})
			return { success: true }
		} catch (error: any) {
			dispatch({
				type: authActionTypes.REGISTER_FAILURE,

				payload: error.message,
			})

			return { success: false, error: error.message }
		}
	}
}
export const loginAfterVerification = (email: string, password: string) => {
	return async (dispatch: Dispatch) => {
		try {
			const authData = await pb
				.collection('users')
				.authWithPassword(email, password)

			const userData = await pb.collection('users').getOne(authData.record.id)

			const payload = {
				login: authData,
				token: authData.token,
				role: userData.role,
				user: authData.record,
			}

			dispatch({ type: authActionTypes.LOGIN_SUCCESS, payload })
			localStorage.setItem('isLoggedIn', 'true')
			localStorage.setItem(
				'pocketbase_auth',
				JSON.stringify({
					token: authData.token,
					userId: authData.record.id,
					role: userData.role,
					email: authData.record.email,
				})
			)
			return true // Indicate successful login
		} catch (error: any) {
			console.error('Error logging in after verification:', error)
			dispatch({ type: authActionTypes.LOGIN_FAILURE, payload: error.message })
			return false // Indicate failed login
		}
	}
}

export const logout = () => {
	return async (dispatch: Dispatch) => {
		try {
			// PocketBase'тен чыгуу
			pb.authStore.clear()

			localStorage.removeItem('isLoggedIn')

			// Локалдык сактагычтан auth маалыматтарын өчүрүү
			localStorage.removeItem('pocketbase_auth')

			dispatch({ type: authActionTypes.LOGOUT })

			// Ийгиликтүү чыгууну көрсөтүү үчүн true кайтарабыз
			return true
		} catch (error) {
			console.error('Logout error:', error)

			// Ката болгондугун көрсөтүү үчүн false кайтарабыз
			return false
		}
	}
}

export const checkAuthState = () => {
	return (dispatch: Dispatch) => {
		const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
		dispatch({
			type: authActionTypes.SET_AUTH_STATE,
			payload: { isLoggedIn },
		})
	}
}

export const addLikedTour = (userId, tourId) => {
	return async () => {
		try {
			const user = await pb.collection('users').getOne(userId)

			if (!user.liked_tours.includes(tourId)) {
				user.liked_tours.push(tourId)

				await pb.collection('users').update(userId, {
					liked_tours: user.liked_tours,
				})

				console.log(`Tour ${tourId} added to liked tours for user ${userId}`)
			} else {
				console.log(`Tour ${tourId} is already liked by user ${userId}`)
			}
		} catch (error) {
			console.error('Error adding liked tour:', error)
		}
	}
}

export const getOneUserById = (userId) => {
	return async (dispatch: Dispatch) => {
		try {
			const user = await pb.collection('users').getOne(userId)
			dispatch({ type: userActionsTypes.GET_ONE_USER, payload: user })
		} catch (error) {
			console.error('Error fetching user:', error)
		}
	}
}
