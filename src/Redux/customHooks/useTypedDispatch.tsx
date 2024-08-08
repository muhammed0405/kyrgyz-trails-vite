import { useDispatch } from "react-redux"
import { bindActionCreators } from "redux"
import * as IUserAction from "../actionCreator/actionCreator"

export const UseTypedDispatch = () => {
	const dispatch = useDispatch()
	return bindActionCreators(IUserAction, dispatch)
}
