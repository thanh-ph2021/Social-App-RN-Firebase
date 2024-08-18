import { AppDispatch, RootState } from "../redux/reducers"
import { useDispatch, useSelector } from "react-redux"

import useAuthContext from "./useAuthContext"
import useChat from "./useChat"
import usePost from "./usePost"
import useDevice from "./useDevice"
import useUser from "./useUser"
import useMedia from "./useMedia"

export { usePost, useAuthContext, useChat, useDevice, useUser, useMedia }

export const useAppDispatch = useDispatch.withTypes<AppDispatch | any>()
export const useAppSelector = useSelector.withTypes<RootState>()