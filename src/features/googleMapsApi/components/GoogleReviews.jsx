import React, { useEffect, useState } from 'react';
import '../../../assets/styles/global.css';

const Reviews = ({ reviews }) => {
  const [seeAll, setSeeAll] = useState([]);

  useEffect(() => {
    setSeeAll(Array(reviews.length).fill(false));
  }, [reviews]);

  const handleText = (i) => {
    const newSeeAll = [...seeAll];
    newSeeAll[i] = !newSeeAll[i];
    setSeeAll(newSeeAll);
  };
  return (
    <>
      <div className="container mx-auto max-w-2xl grid grid-cols-1 gap-2">
        {reviews !== null && reviews !== '' && reviews.map((rv, i) => (
          <div
            key={i}
            className={`border flex border-dotted rounded-xl p-2 ${
              seeAll == false ? 'max-h-50 text-ellipsis' : 'max-h-full'
            }`}
          >
            <div className="min-w-50 flex flex-col items-center">
              <div>
                <strong>사용자명</strong> : {rv.author_name}
              </div>
              <img src={`${rv.profile_photo_url}`} alt={`${rv.author_name}`} className="w-20" />
            </div>
            <div className="max-w-118">
              <div>
                <strong>사용자 평점</strong> : {rv.rating}☆
              </div>
              <div>
                <strong>사용자 평가</strong> <br />
                <p
                  className={`mouse_pointer indent-2 ${
                    seeAll[i] ? 'line-clamp-none' : 'line-clamp-2'
                  }`}
                  onClick={() => handleText(i)}
                >
                  {rv.text ? rv.text : '사용자 평가 없음'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Reviews;
