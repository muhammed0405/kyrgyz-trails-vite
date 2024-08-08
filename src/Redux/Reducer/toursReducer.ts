/** @format */

import { userActionsTypes } from "../actionTypes/actionTypes"
import { ITourState } from "../Interfaces/tourReducerType"
const initialState: ITourState = {
	regions: [],
	tours: [],
	loading: false,
	error: null,
}

export const toursReducer = (
	state = initialState,
	action: { type: string; payload: any }
) => {
	switch (action.type) {
		case userActionsTypes.GET_LOCATIONS:
			return {
				...state,
				regions: action.payload,
				loading: false,
				error: null,
			}

		case "GET_LOCATIONS_ERROR":
			return { ...state, loading: false, error: action.payload }

		case userActionsTypes.GET_USER_TOURS_SUCCESS:
			return {
				...state,
				tours: action.payload,
				loading: false,
				error: null,
			}
		default:
			return state
	}
}
