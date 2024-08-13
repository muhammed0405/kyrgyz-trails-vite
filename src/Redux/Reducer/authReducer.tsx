/** @format */

import { authActionTypes } from "../actionTypes/authActionTypes"

const initialState = {
	login: {},
	isLoading: false,
	error: null,
	isAuth: false,
	email: null,
	password: null,
	emailVerified: false,
	isLoggedIn: false,
}

export const authReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case authActionTypes.LOGIN_REQUEST:
		case authActionTypes.REGISTER_REQUEST:
			return {
				...state,
				isLoading: true,
				error: null,
			}

		case authActionTypes.LOGIN_SUCCESS:
			return {
				...state,
				login: action.payload,
				isLoading: false,
				isAuth: true,
				email: null,
				password: null,
				isLoggedIn: true,
			}

		case authActionTypes.REGISTER_SUCCESS:
			return {
				...state,
				isLoading: false,
				email: action.payload.email,
				password: action.payload.password,
			}

		case authActionTypes.LOGIN_FAILURE:
		case authActionTypes.REGISTER_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload,
			}

		case authActionTypes.LOGOUT:
			return {
				...initialState,
				isLoggedIn: false,
			}

		case authActionTypes.EMAIL_VERIFIED:
			return {
				...state,
				emailVerified: true,
			}

		case authActionTypes.SET_AUTH_STATE:
			return {
				...state,
				isAuth: action.payload.isAuth,
				isLoggedIn: action.payload.isLoggedIn,
				login: {
					token: action.payload.token,
					user: action.payload.user,
				},
			}

		default:
			return state
	}
}
