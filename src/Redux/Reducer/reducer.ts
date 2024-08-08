/** @format */

import { combineReducers } from "redux"
import { userReducer } from "./userReducer"
import { toursReducer } from "./toursReducer"
import { guideReducer } from "./guideReducer"
export const rootReducer = combineReducers({
	user: userReducer,
	tours: toursReducer,
	guide: guideReducer,
})

export type RootState = ReturnType<typeof rootReducer>
