/** @format */

import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import * as IUserAction from "../actionCreator/actionCreator"
import * as ICommentAction from "../actionCreator/actionComments"

export const UseTypedDispatch = () => {
	const dispatch = useDispatch()
	return bindActionCreators({ ...IUserAction, ...ICommentAction }, dispatch)
}
