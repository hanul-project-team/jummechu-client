import react from 'react'
import '../../assets/styles/global.css'
import HomeRecommand from '../../features/home/HomeRecommand.jsx'
import KakaoMaps from '../../shared/kakaoMapsApi/KakaoMaps.jsx'

const HomeSearch = () => {
  return (
    <>
      <div className="w-full pb-5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-5">
            <KakaoMaps />
          </div>
          <HomeRecommand />
        </div>
      </div>
    </>
  )
}

export default HomeSearch
