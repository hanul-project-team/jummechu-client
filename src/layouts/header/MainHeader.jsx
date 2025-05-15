import React from 'react'
import { useSelector } from 'react-redux'

const MainHeader = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const user = useSelector(state => state.auth.user)
  console.log(isAuthenticated)
  console.log(user)
  return (
    <div>MainHeader</div>
  )
}

export default MainHeader