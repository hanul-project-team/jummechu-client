import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  userFound: undefined,
  user: {
    name: '',
    email: '',
    createdAt: '',
  },
}

const findAccountSlice = createSlice({
  name: 'findAccount',
  initialState,
  reducers: {
    find: (state, action) => {
      state.userFound = action.payload.userFound
      state.user = action.payload.user
    },
    reset: (state) => {
      state.userFound = initialState.userFound
      state.user = initialState.user
    },
  },
})

export const { find, reset } = findAccountSlice.actions
export default findAccountSlice.reducer
