/** @format */

import { applyMiddleware, createStore } from "redux"
import { thunk } from "redux-thunk"
import { rootReducer } from "./Reducer/reducer"
import { composeWithDevTools } from "@redux-devtools/extension"

export const makeStore = createStore(
	rootReducer,
	composeWithDevTools(applyMiddleware(thunk))
)
