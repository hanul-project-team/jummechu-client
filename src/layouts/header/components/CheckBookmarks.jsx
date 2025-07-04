import react, { useEffect, useRef } from 'react'
import { API } from '../../../app/api.js'
import zustandUser from '../../../app/zustandUser.js'
import { useSelector } from 'react-redux'
import zustandStore from '../../../app/zustandStore.js'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const CheckBookmarks = () => {
  const user = useSelector(state => state.auth.user)
  const userBookmark = zustandUser(state => state.userBookmark)
  const bookmarkRef = useRef(userBookmark)
  const setIsBookmarked = zustandUser(state => state.setIsBookmarked)
  const setUserBookmark = zustandUser(state => state.setUserBookmark)
  const placeDetail = zustandStore(state => state.placeDetail)
  const location = useLocation()
  const locationRef = useRef(location?.state)

  const handleCheckBookmarked = (place, lists) => {
    const filteredBookmark = lists?.filter(list => list?.store?._id === place?._id)
    if (filteredBookmark?.length > 0) {
      setIsBookmarked(true)
    } else {
      setIsBookmarked(false)
    }
    return
  }

  useEffect(() => {
    if (user?.role.length !== 0) {
      if (!userBookmark || userBookmark !== bookmarkRef.current) {
        getUserBookmark()
      }
    }
    if (user?.role.length > 0 && userBookmark && placeDetail) {
      handleCheckBookmarked(placeDetail, userBookmark)
    }

    if (location.state?._id && location.state !== locationRef.current) {
      locationRef.current = location.state
      handleCheckBookmarked(location.state, userBookmark)
    }
  }, [userBookmark, placeDetail, location.state])

  const getUserBookmark = () => {
    API.get(`/bookmark/read/${user?.id}`)
      .then(res => {
        const data = res.data
        setUserBookmark(data)
        bookmarkRef.current = data
      })
      .catch(err => {
        toast.error(
          <div className="Toastify__toast-body cursor-default">북마크 갱신 실패</div>,
          {
            position: 'top-center',
          },
        )
      })
  }
}

export default CheckBookmarks