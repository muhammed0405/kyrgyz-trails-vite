/** @format */

import { authActionTypes } from "../actionTypes/authActionTypes"

const initialState = {
	login: {},
	isLoading: false,
	error: null,
	isAuth: false,
}

const authReducer = (state = initialState, action: any) => {
	switch (action.type) {
		case authActionTypes.LOGIN_REQUEST:
			return {
				...state,
				isLoading: true,
			}
		case authActionTypes.LOGIN_SUCCESS:
			return {
				...state,
				login: action.payload,
				isLoading: false,
				isAuth: true,
			}
		case authActionTypes.LOGIN_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload,
			}

		case authActionTypes.REGISTER_REQUEST:
			return {
				...state,
				isLoading: true,
			}
		case authActionTypes.REGISTER_SUCCESS:
			return {
				...state,
				isLoading: false,
				isAuth: true,
			}
		case authActionTypes.REGISTER_FAILURE:
			return {
				...state,
				isLoading: false,
				error: action.payload,
			}

		default:
			return state
	}
}
