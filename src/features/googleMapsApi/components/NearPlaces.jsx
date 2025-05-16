import React from 'react'

const NearPlaces = ({nearPlaces}) => {
  return (
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
  )
}

export default NearPlaces