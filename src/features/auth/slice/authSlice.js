import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const restoreLogin = createAsyncThunk('auth/restoreLogin', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:3000/auth/restore_login', { withCredentials: true })
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
  isAuthenticated: undefined,
  user: {
    id:'',
    name: '',
    profileImage: '',
    role: '',
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
      state.user.id = ''
      state.user.name = ''
      state.user.profileImage = ''
      state.user.role = ''
    },
  },
  extraReducers: build => {
    build.addCase(restoreLogin.pending, state => {
      state.error = ''
    })
    build.addCase(restoreLogin.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated
      state.user = action.payload.user
    }),
      build.addCase(restoreLogin.rejected, (state, action) => {
        state.error = action.payload
        state.isAuthenticated = false
      })
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
