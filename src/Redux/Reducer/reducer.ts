/** @format */

import { combineReducers } from "redux"
import { userReducer } from "./userReducer"
import { toursReducer } from "./toursReducer"
import { guideReducer } from "./guideReducer"
import { authReducer } from "./authReducer"
export const rootReducer = combineReducers({
	user: userReducer,
	tours: toursReducer,
	guide: guideReducer,
	auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>
