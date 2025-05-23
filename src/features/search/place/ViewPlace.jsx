import React, { useEffect, useState } from 'react'
import usePlaceStore from '../../../store/usePlaceStore'
import ViewPlaceDetail from './components/ViewPlaceDetail'
import { useLocation } from 'react-router-dom'

const ViewPlace = () => {
  // const [placeInfo, setPlaceInfo] = useState([])
  const [defaultBookmarked, setdefaultBookmarked] = useState(false)
  const location = useLocation()
  const setPlaceDetail = usePlaceStore(state => state.setPlaceDetail)

  useEffect(() => {
    if (location.state) {
      // setPlaceInfo(location.state)
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
