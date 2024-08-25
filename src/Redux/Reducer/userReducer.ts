/** @format */

import { IUserAction, IUserState } from '../Interfaces/interFaces'
import { userActionsTypes } from '../actionTypes/actionTypes'

const initialState: IUserState = {
	users: [],
	loading: false,
	error: null,
	user: {},
}

// reducer
export const userReducer = (
	state = initialState,
	action: IUserAction
): IUserState => {
	switch (action.type) {
		case userActionsTypes.GET_USER_SUCCESS:
			return {
				...state,
				users: [...state.users, action.payload],
				loading: false,
				error: null,
			}

		case userActionsTypes.GET_USER_ERROR:
			return {
				...state,
				loading: false,
				error: action.payload!,
			}

		case userActionsTypes.GET_ONE_USER:
			return {
				...state,
				user: action.payload,
			}
		default:
			return state
	}
}
