import React, { useEffect, useState } from 'react'
import usePlaceStore from '../../store/usePlaceStore'

const KakaoMaps = () => {
  useEffect(() => {
    const nowLocation = navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        console.log('y:'+latitude, 'x:'+longitude)
      },
      error => {
        console.error(error)
      },
    )
  }, [])
  return (
    <>
      <div>KakaoMaps</div>
    </>
  )
}

export default KakaoMaps
