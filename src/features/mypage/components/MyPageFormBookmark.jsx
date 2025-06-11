import React, { useState } from 'react'
import zustandUser from '../../../app/zustandUser.js'


const MyPageFormBookmark = () => {
    const userBookmark = zustandUser(state => state.userBookmark)
    console.log(userBookmark)
  return (
    <div>MyPageFormBookmark</div>
  )
}

export default MyPageFormBookmark