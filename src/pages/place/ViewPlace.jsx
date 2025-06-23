import React, { useEffect, useState } from 'react'
import zustandStore from '../../app/zustandStore.js'
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx'
import { useLocation, useParams } from 'react-router-dom'
import { API } from '../../app/api.js'

const ViewPlace = () => {
  const location = useLocation()
  const setPlaceDetail = zustandStore(state => state.setPlaceDetail)
  const setIsLoading = zustandStore(state => state.setIsLoading)
  const params = useParams()
  const placeId = params.id
  useEffect(() => {
    if (location.state && location.state._id === placeId) {
      setPlaceDetail(location.state)
      setIsLoading(false)
    } else {
      API.get(`/store/read/${placeId}`)
        .then(res => {
          setPlaceDetail(res.data)
          setIsLoading(false)
        })
        .catch(err => {
          console.error(err)
          setIsLoading(false)
        })
    }
  }, [location.state, placeId])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return <ViewPlaceDetail />
}

export default ViewPlace
