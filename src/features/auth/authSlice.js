import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const authCheck = createAsyncThunk('auth/authCheck', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:3000/auth/check', { withCredentials: true })
    return response.data
  } catch (e) {
    if (e.response.status === 401 || e.response.status === 404) {
      return rejectWithValue(e.response.data.message)
    } else {
      return rejectWithValue('알 수 없는 에러 발생')
    }
  }
})

const initialState = {
  isAuthenticated: false,
  user: {
    name: '',
    profileImage: '',
    role: 'guest',
  },
  error: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user
      state.error = ''
    },
    logout: state => {
      state.isAuthenticated = false
      state.user.name = ''
      state.user.profileImage = ''
      state.user.role = 'guest'
    },
  },
  extraReducers: build => {
    build.addCase(authCheck.pending, state => {
      state.error = ''
    })
    build.addCase(authCheck.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user
    }),
      build.addCase(authCheck.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
