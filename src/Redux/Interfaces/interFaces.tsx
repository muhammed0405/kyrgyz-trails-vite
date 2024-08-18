/** @format */

import { userActionsTypes } from "../actionTypes/actionTypes"

export interface IUserType {
	id: number
	name: string
	username: string
	email: string
	phone: string
}

export interface IUserState {
  users: IUserType[];
  loading: boolean;
  error: string | null;
}

export interface ILocation {
  name: string;
  title: string;
  content: string;
  image: string;
}

export interface ILocationsSuccess {
  type: userActionsTypes.GET_LOCATIONS;
  payload: ILocation[];
}

export interface ILocationsError {
  type: userActionsTypes.GET_LOCATIONS_ERROR;
  payload?: string;
}

export interface IUserSuccess {
  type: userActionsTypes.GET_USER_SUCCESS;
  success: boolean;

  payload: IUserType;
}
export interface IUserError {
  type: userActionsTypes.GET_USER_ERROR;
  payload: string;
}
export interface IUserLoading {
  type: userActionsTypes.GET_USER_LOADING;
  payload: boolean;
}

export type IUserAction =
  | IUserSuccess
  | IUserError
  | IUserLoading
  | ILocationsSuccess
  | ILocationsError;
