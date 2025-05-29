import react, { useEffect, useRef } from 'react'
import '../../assets/styles/global.css'
import axios from 'axios'
import zustandUser from '../../app/zustandUser.js'
import { useSelector } from 'react-redux'
import HomeRecommand from './components/HomeRecommand.jsx'

const HomeSearch = () => {
  const setUserBookmark = zustandUser(state => state.setUserBookmark)
  const userBookmark = zustandUser(state => state.userBookmark)
  const user = useSelector(state => state.auth.user)
  const bookmarkRef = useRef()

  useEffect(() => {
    if (user && !bookmarkRef.current) {
      if (userBookmark.length < 1 || userBookmark !== bookmarkRef.current) {
        axios.get(`http://localhost:3000/bookmark/read/${user.id}`, {
          withCredentials: true
        })
        .then((res) => {
          const data = res.data
          console.log(data)
          setUserBookmark(data)
          bookmarkRef.current = data
        })
        .catch((err) => {
          console.error('북마크 갱신 실패',err)
        })
      }
    }
  }, [bookmarkRef.current, userBookmark])
  console.log(bookmarkRef.current)
  console.log(userBookmark)
  return (
    <>
      <div className="w-full pb-5">
        <div className="max-w-5xl mx-auto">
          <HomeRecommand />
        </div>
      </div>
    </>
  )
}

export default HomeSearch
