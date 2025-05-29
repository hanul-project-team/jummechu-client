import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/slice/authSlice'
import findAccountSliceReducer from '../features/auth/slice/findAccountSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    findAccount: findAccountSliceReducer,
  },
})

export default store
