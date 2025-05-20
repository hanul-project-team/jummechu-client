import React, { useEffect, useState } from 'react'
import usePlaceStore from '../../store/usePlaceStore'
import ViewPlaceDetail from './components/ViewPlaceDetail'

const ViewPlace = () => {
  const placeDetail = usePlaceStore(state => state.placeDetail)
  const [placeInfo, setPlaceInfo] = useState([])
  const [defaultBookmarked, setdefaultBookmarked] = useState(false)
  // const bookmarkId = placeDetail?.id

  useEffect(() => {
    if (placeDetail) {
      setPlaceInfo(placeDetail)
    }
  }, [placeDetail, defaultBookmarked])

  // console.log(placeInfo)
  // console.log(placeDetail)
  return (
    <ViewPlaceDetail
      placeInfo={placeInfo}
      defaultBookmarked={defaultBookmarked}
    />
  )
}

export default ViewPlace
