import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/slice/authSlice'
import findAccountIdSliceReducer from '../features/auth/slice/findAccountIdSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    findAccountId: findAccountIdSliceReducer,
  },
})

export default store
