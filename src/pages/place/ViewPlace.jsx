import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx'
import { useLocation } from 'react-router-dom'

const ViewPlace = () => {
  const location = useLocation()
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)
  const setIsLoading = zustandStore(state => state.setIsLoading)
  
  useEffect(() => {
    if (location.state) {
      setPlaceDetail(location.state)
      if(location.state?._id) {
        setIsLoading(false)
      }
    }
  }, [location.state])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return <ViewPlaceDetail />
}

export default ViewPlace
