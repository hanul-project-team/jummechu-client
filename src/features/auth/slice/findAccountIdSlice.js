import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    name: '',
    email: '',
    createdAt: '',
  },
}

const findAccountIdSlice = createSlice({
  name: 'findAccountId',
  initialState,
  reducers: {
    findId: (state, action) => {
      state.user = action.payload.user
    },
  },
})

export const { findId } = findAccountIdSlice.actions
export default findAccountIdSlice.reducer
