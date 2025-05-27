import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx'
import { useLocation } from 'react-router-dom'

const ViewPlace = () => {
  const [defaultBookmarked, setdefaultBookmarked] = useState(false)
  const location = useLocation()
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)
  
  useEffect(() => {
    if (location.state) {
      setPlaceDetail(location.state)
    }
  }, [location.state, defaultBookmarked])

  // console.log(location.state)

  return (
    <ViewPlaceDetail
      // placeInfo={placeInfo}
      defaultBookmarked={defaultBookmarked}
    />
  )
}

export default ViewPlace
