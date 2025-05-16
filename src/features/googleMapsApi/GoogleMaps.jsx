import React, { useEffect, useRef } from 'react'
import axios from 'axios'
import '../../assets/styles/global.css'
import usePlaceStore from '../../store/usePlaceStore.js'
import { useLocation, useNavigate } from 'react-router-dom'
import NearPlaces from './components/NearPlaces.jsx'

const GoogleMaps = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const setPlaceDetails = usePlaceStore(state => state.setPlaceDetails)
  const setNearPlaces = usePlaceStore(state => state.setNearPlaces)
  const setCenter = usePlaceStore(state => state.setCenter)
  const setKakaoPlace = usePlaceStore(state => state.setKakaoPlace)

  const center = usePlaceStore(state => state.center)
  const placeDetails = usePlaceStore(state => state.placeDetails)
  const nearPlaces = usePlaceStore(state => state.nearPlaces)

  const mapRef = useRef(null)
  const pickerRef = useRef(null)
  const isRoot = location.pathname === '/'

  const MAX_RETRY = 3
  const RETRY_DELAY = 1000

  useEffect(() => {
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

    const checkAndInit = async () => {
      if (window.google && window.google.maps) {
        await init()
      } else {
        setTimeout(checkAndInit, 300)
      }
    }

    const init = async () => {
      await window.customElements.whenDefined('gmp-map')

      const map = document.querySelector('gmp-map')
      const marker = document.querySelector('gmp-advanced-marker')
      const placePicker = document.querySelector('gmpx-place-picker')
      const infowindow = new window.google.maps.InfoWindow()

      const placesService = new window.google.maps.places.PlacesService(map.innerMap)

      map.innerMap.setOptions({ mapTypeControl: false })

      if (
        mapRef.current &&
        center?.lat &&
        center?.lng &&
        (mapRef.current.center?.lat !== center.lat || mapRef.current.center?.lng !== center.lng)
      ) {
        mapRef.current.center = center
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async function (position) {
            let latitude = position.coords.latitude
            let longitude = position.coords.longitude

            // console.log('현재 위치: 위도=' + latitude + ', 경도=' + longitude)
            const nowLocation = new window.google.maps.LatLng(latitude, longitude)
            setCenter({
              lng: longitude,
              lat: latitude,
            })

            if (isRoot === true) {
              await axios
                .get('http://localhost:3000', {
                  withCredentials: true,
                  headers: {
                    location: nowLocation,
                  },
                })
                .then(res => {
                  // console.log(res)
                  setNearPlaces(res.data)
                })
                .catch(err => {
                  console.log(err)
                })
            }

            if (pickerRef.current) {
              const shadow = pickerRef.current.shadowRoot
              const input = shadow?.querySelector('input')
              if (input) {
                input.style.borderRadius = '1.2rem'
                const handleKeyDown = e => {
                  // console.log('초기 검색어:', e.target.value)
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    // if (e.target.value && mapRef?.current?.center) {
                    if (e.target.value && nowLocation) {
                      attemptKakaoPatch(
                        e.target.value,
                        {
                          lat: nowLocation.lat,
                          lng: nowLocation.lng,
                        },
                        // {
                        //   lat: mapRef.current.center.lat,
                        //   lng: mapRef.current.center.lng,
                        // },
                        0,
                      )
                    } else {
                      console.log('검색어와 위치정보를 기다리는 중입니다.')
                    }
                  }
                }
                input.addEventListener('keydown', handleKeyDown)
                return () => {
                  input.removeEventListener('keydown', handleKeyDown)
                }
              }
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
          navigate('/')
          return
        }

        if (place.id) {
          const getDetailsInfo = placesService.getDetails(
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
                'place_id',
              ],
            },
            (result, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK && result) {
                navigate(`/place/${place.id}`)
                setPlaceDetails(result)
                const lat = result.geometry.location.lat()
                const lng = result.geometry.location.lng()
                setCenter({
                  lat: lat,
                  lng: lng,
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

  const kakaoPatch = (search, location) => {
    return new Promise((resolve, reject) => {
      if (search && location) {
        axios
          .post(
            'http://localhost:3000/api/search',
            { place: search, location: location },
            {
              withCredentials: true,
            },
          )
          .then(res => {
            const data = res.data
            // console.log(data)
            setKakaoPlace(data)
            resolve(res)
          })
          .catch(err => {
            console.error('kakaoPatch 에러', err)
            reject(err)
          })
      } else {
        console.log('장소 또는 위치 정보가 누락되어있습니다.')
        reject('장소 또는 위치 정보가 누락되었습니다.')
      }
    })
  }

  const attemptKakaoPatch = (search, location, retryCount) => {
    kakaoPatch(search, location)
      .then(res => {
        console.log(res.data)
        console.log('요청 성공')
      })
      .catch(err => {
        if (retryCount < MAX_RETRY) {
          console.log(`재시도 (${retryCount + 1}/${MAX_RETRY}) 검색:`, search, '위치:', location)
          setTimeout(() => {
            attemptKakaoPatch(search, location, retryCount + 1)
          }, RETRY_DELAY)
        } else {
          console.log('최대 재시도 횟수 초과.')
        }
      })
  }
  // console.log(placeDetails)
  return (
    <div className="text-center py-3">
      {isRoot === true ? (
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
      ) : (
        <div
          slot="control-block-start-inline-start"
          className="place-picker-container flex flex-col items-center gap-3"
        >
          <gmpx-place-picker
            ref={pickerRef}
            className="gmpx-place-picker absolute top-2/100"
            placeholder="추천 태그 | #카페 #식사 #혼밥"
          />
          <gmp-map ref={mapRef} zoom={13} map-id="DEMO_MAP_ID">
            <gmp-advanced-marker position={center} />
          </gmp-map>
        </div>
      )}
      {isRoot === true && placeDetails == null && (nearPlaces?.length ?? 0) > 0 && (
        <NearPlaces nearPlaces={nearPlaces} />
      )}
    </div>
  )
}

export default GoogleMaps
