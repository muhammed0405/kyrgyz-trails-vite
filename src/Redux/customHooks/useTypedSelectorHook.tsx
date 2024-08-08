import { TypedUseSelectorHook } from "react-redux"
import { RootState } from "../Reducer/reducer"
import { useSelector } from "react-redux"

export const useTypedSelectorHook : TypedUseSelectorHook<RootState> = useSelector



