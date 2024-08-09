/** @format */
import axios from "axios"
import { Dispatch } from "redux"
import { userActionsTypes } from "../actionTypes/actionTypes"

export const getRegions = () => async (dispatch: Dispatch) => {
	const regionUrl =
		"https://kyrgyz-tra.pockethost.io/api/collections/locations/records"
	try {
		const response = await axios.get(regionUrl)
		dispatch({
			type: userActionsTypes.GET_LOCATIONS,
			payload: response.data,
		})
		console.log("Data fetched successfully:", response.data)
	} catch (error) {
		console.error("Error fetching data:", error)
		dispatch({
			type: userActionsTypes.GET_LOCATIONS_ERROR,
			payload: "Error fetching data. Please try again later.",
		})
	}
}

export const getTours = (): Promise<void> => async (dispatch: Dispatch) => {
	try {
		const url = "https://kyrgyz-tra.pockethost.io/api/collections/tours/records"
		const response = await axios.get(url)
		dispatch({
			type: userActionsTypes.GET_USER_TOURS_SUCCESS,
			payload: response.data,
		})
		console.log("Data fetched successfully tours:", response.data)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Error details:", error.response?.data)
			if (error.response?.status === 403) {
				dispatch({
					type: userActionsTypes.GET_USER_TOURS_ERROR,
					payload: "Access forbidden. Please try logging in again.",
				})
			} else {
				dispatch({
					type: userActionsTypes.GET_USER_TOURS_ERROR,
					payload: `An error occurred: ${error.message}`,
				})
			}
		} else {
			console.error("An unexpected error occurred:", error)
			dispatch({
				type: userActionsTypes.GET_USER_TOURS_ERROR,
				payload: "An unexpected error occurred. Please try again.",
			})
		}
	}
}
