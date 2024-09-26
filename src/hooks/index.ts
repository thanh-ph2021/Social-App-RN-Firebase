import { useDispatch, useSelector } from "react-redux"

import { AppDispatch, RootState } from "../redux/reducers"
import useAuthContext from "./useAuthContext"
import useUser from "./useUser"
import useMedia from "./useMedia"

export { useAuthContext, useUser, useMedia }

export const useAppDispatch = useDispatch.withTypes<AppDispatch | any>()
export const useAppSelector = useSelector.withTypes<RootState>()