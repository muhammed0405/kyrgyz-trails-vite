/** @format */

import { userActionsTypes } from "../actionTypes/actionTypes";

export const initialState = {
  guideTours: [],
  loading: false,
  error: null,
};

export const guideReducer = (
  state = initialState,
  action: { type: any; payload: any }
) => {
  switch (action.type) {
    case userActionsTypes.GET_GUIDE_TOURS_SUCCESS:
      return {
        ...state,
        guideTours: action.payload,
        loading: false,
        error: null,
      };
    case userActionsTypes.GET_GUIDE_TOURS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
