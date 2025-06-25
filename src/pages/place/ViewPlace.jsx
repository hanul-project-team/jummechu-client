import { useLocation, useParams } from 'react-router-dom'
import { API } from '../../app/api.js'
import { toast } from 'react-toastify'
import React, { useEffect } from 'react'
import zustandStore from '../../app/zustandStore.js'
import ViewPlaceDetail from '../../features/place/ViewPlaceDetail.jsx'
import RecentViewPlace from './RecentViewPlace.jsx'

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
          toast.error(
            <div className="Toastify__toast-body cursor-default">잠시 후 다시 시도해주세요.</div>,
            {
              position: 'top-center',
            },
          )
          setIsLoading(false)
        })
    }
  }, [location.state, placeId])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div>
      <ViewPlaceDetail />
      <RecentViewPlace />
    </div>
  )
}

export default ViewPlace
