/** @format */

import { userActionsTypes } from '../actionTypes/actionTypes'

export interface IUserType {
	username: string
	email: string
	password: string
	confirmPassword: string
	role: string
	emailVisibility: boolean
}
export interface IUserData {
	username: string
	email: string
	role: string
	emailVisibility: boolean
}

export interface IUserState {
	users: IUserType[]
	loading: boolean
	error: string | null
	user: IUserData
}

export interface ILocation {
	name: string
	title: string
	content: string
	image: string
}

export interface ILocationsSuccess {
	type: userActionsTypes.GET_LOCATIONS
	payload: ILocation[]
}

export interface ILocationsError {
	type: userActionsTypes.GET_LOCATIONS_ERROR
	payload?: string
}

export interface IUserSuccess {
	type: userActionsTypes.GET_USER_SUCCESS
	success: boolean

	payload: IUserType
}
export interface IUserError {
	type: userActionsTypes.GET_USER_ERROR
	payload: string
}
export interface IUserLoading {
	type: userActionsTypes.GET_USER_LOADING
	payload: boolean
}

export interface IGetUserData {
	type: userActionsTypes.GET_ONE_USER
	payload: IUserData
}

export type IUserAction =
	| IUserSuccess
	| IUserError
	| IUserLoading
	| ILocationsSuccess
	| ILocationsError
	| IGetUserData
