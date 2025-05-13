import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import GoogleReviews from './components/GoogleReviews.jsx'
import '../../assets/styles/global.css'

const HomeSearch = () => {
  const [placeDetails, setPlaceDetails] = useState(null)
  const [nearPlaces, setNearPlaces] = useState([])
  const [center, setCenter] = useState(null)
  const [placeName, setPlaceName] = useState(null)
  const [kakaoPlace, setKakaoPlace] = useState(null)

  const mapRef = useRef(null)
  const pickerRef = useRef(null)

  if (mapRef.current && center?.lat && center?.lng) {
    mapRef.current.center = center
  }

  useEffect(() => {
    const checkAndInit = () => {
      if (window.google && window.google.maps) {
        init()
      } else {
        setTimeout(checkAndInit, 300)
      }
    }
    const loadScript = () => {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.6.11'
      script.async = true
      script.defer = true
      script.onload = () => {
        checkAndInit()
      }
      document.head.appendChild(script)
    }
    loadScript()

    const init = async () => {
      await window.customElements.whenDefined('gmp-map')

      const map = document.querySelector('gmp-map')
      const marker = document.querySelector('gmp-advanced-marker')
      const placePicker = document.querySelector('gmpx-place-picker')
      const infowindow = new window.google.maps.InfoWindow()

      if (pickerRef.current) {
        const shadow = pickerRef.current.shadowRoot
        const input = shadow?.querySelector('input')
        if (input) {
          input.style.borderRadius = '1.2rem'
        }
      }

      const placesService = new window.google.maps.places.PlacesService(map.innerMap)

      map.innerMap.setOptions({ mapTypeControl: false })

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async function (position) {
            let latitude = position.coords.latitude
            let longitude = position.coords.longitude
            setCenter({
              lat: latitude,
              lng: longitude,
            })
            console.log('현재 위치: 위도=' + latitude + ', 경도=' + longitude)
            const location = new window.google.maps.LatLng(latitude, longitude)

            try {
              await axios
                .get('http://localhost:3000', {
                  withCredentials: true,
                  headers: {
                    location: location,
                  },
                })
                .then(res => {
                  // console.log(res)
                  setNearPlaces(res.data)
                })
                .catch(err => {
                  console.log(err)
                })
            } catch (err) {
              console.log(err)
            }
          },
          function (error) {
            console.log('위치 정보 가져오기 실패: ' + error.message)
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          },
        )
      } else {
        console.log('Geolocation API를 지원하지 않는 브라우저입니다.')
      }

      placePicker.addEventListener('gmpx-placechange', async () => {
        const place = placePicker.value

        if (!place || !place.location) {
          console.log('선택된 장소에 위치 정보가 없습니다.')
          setPlaceDetails(null)
          mapRef.current.style.display = 'none'
          return
        }

        if (place.id) {
          placesService.getDetails(
            {
              placeId: place.id,
              fields: [
                'name',
                'formatted_address',
                'rating',
                'reviews',
                'photos',
                'formatted_phone_number',
                'types',
                'geometry',
                // 'opening_hours',
              ],
            },
            (result, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                setPlaceDetails(result)
                setPlaceName(result.name)
                const lat = result.geometry.location.lat()
                const lng = result.geometry.location.lng()
                setCenter({
                  lat: lat,
                  lng: lng,
                })

                const kakaoData = axios
                  .post('http://localhost:3000', result, {
                    withCredentials: true,
                  })
                  .then(res => {
                    const data = res.data
                    // console.log(data)
                    setKakaoPlace(data)
                  })
                  .catch(res => {
                    console.log(res)
                  })

                infowindow.setContent(`
                      <strong>${result.name}</strong><br/>
                      ${result.formatted_address}<br/>
                      평점: ${result.rating}<br/>
                      리뷰: ${result.reviews?.[0]?.text || '없음'}
                    `)
                infowindow.open(map.innerMap, marker)
              }
              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                infowindow.setContent(`
                  <strong>${result.name}</strong><br/>
                  ${result.formatted_address}<br/>
                  평점: ${result.rating}<br/>
                  리뷰: ${result.reviews?.[0]?.text || '없음'}
                `)
                infowindow.open(map.innerMap, marker)
              } else {
                if (place && place.location) {
                  placesService.nearbySearch(
                    {
                      location: place.location,
                      radius: 1000,
                      type: 'restaurant',
                    },
                    (results, status) => {
                      if (
                        status === window.google.maps.places.PlacesServiceStatus.OK &&
                        results.length > 0
                      ) {
                        const alt = results[0]
                        infowindow.setContent(`
                          <strong>${alt.name}</strong><br/>
                          주소: ${alt.vicinity}<br/>
                          평점: ${alt.rating}
                        `)
                        marker.position = alt.geometry.location
                        infowindow.open(map.innerMap, marker)
                      } else {
                        infowindow.setContent('주변에 유사 장소를 찾을 수 없습니다.')
                        infowindow.open(map.innerMap, marker)
                      }
                    },
                  )
                } else {
                  console.log('장소가 선택되지 않았거나 위치 정보가 없습니다.')
                }
              }
            },
          )
        } else {
          alert('선택된 장소에 place_id가 없습니다.')
        }
      })
    }
  }, [])
  const isNameExist = !!placeDetails?.name
  if (mapRef.current) {
    if (isNameExist) {
      mapRef.current.style.display = 'block'
    } else {
      mapRef.current.style.display = 'none'
    }
  }
  // console.log(isNameExist);

  return (
    <div className="text-center py-3">
      <div
        slot="control-block-start-inline-start"
        className="place-picker-container flex flex-col items-center gap-3"
      >
        <gmpx-place-picker
          ref={pickerRef}
          className="gmpx-place-picker"
          placeholder="추천 태그 | #카페 #식사 #혼밥"
        />
        <p className="text-xs">
          내 근처 맛집을 추천받고 싶다면 브라우저의 위치권한을 허용해주세요!
        </p>
        <gmp-map ref={mapRef} zoom={13} map-id="DEMO_MAP_ID">
          <gmp-advanced-marker position={center} />
        </gmp-map>
      </div>
      {placeDetails?.length >= 1 &&
        placeDetails.map((place, i) => (
          <div key={i}>
            <h3>{place.name}</h3>
          </div>
        ))}
      {placeDetails && (
        <div className="container max-w-6xl mx-auto text-start">
          <div className="flex gap-4 align-center justify-center">
            {placeDetails.photos !== undefined
              ? placeDetails.photos.slice(0, 4).map((photo, i) => (
                  <div key={i} className="w-64 h-64 overflow-hidden my-2">
                    <img
                      src={photo.getUrl()}
                      alt={`place-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              : '사진 정보가 존재하지 않음'}
          </div>
          <h3 className="text-3xl">{placeDetails.name}</h3>
          <div>
            <p>{placeDetails.formatted_address}</p>
            <p>문의전화 : {placeDetails.formatted_phone_number}</p>
            <p>평점 : {placeDetails.rating}☆</p>
          </div>
          <GoogleReviews reviews={placeDetails.reviews && placeDetails.reviews} />
        </div>
      )}
      {placeDetails == null && (nearPlaces?.length ?? 0) > 0 && (
        <div>
          <h2 className="text-3xl font-bold">주변 음식점</h2>
          <div className="flex gap-4 container mx-auto max-w-5xl overflow-x-auto my-5">
            {nearPlaces.map((np, i) => {
              return (
                np.rating && (
                  <div
                    className="container max-w-2xl mx-auto text-start border border-dotted rounded-xl p-2"
                    key={i}
                  >
                    <div className="flex gap-2 align-center justify-center">
                      <strong className="w-40 text-center">{np.name}</strong>
                      <img src={`${np.photos}`} alt="" />
                      <div>
                        <p>{np.rating + '☆'}</p>
                        <p className="w-40">{np.vicinity ? np.vicinity : '주소지 미제공'}</p>
                      </div>
                    </div>
                  </div>
                )
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default HomeSearch
