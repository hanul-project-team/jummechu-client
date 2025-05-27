import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts'

const ReviewChart = ({ reviews }) => {
  if (reviews.length > 0) {
    const rating = reviews.map(rv => {
      return { rating: rv.rating }
    })
  }
  // console.log(rating)
  const ratingLabel = {
    5: '매우 만족',
    4: '만족',
    3: '보통',
    2: '불만족',
    1: '매우불만족',
  }
  const countMap = [5, 4, 3, 2, 1].map(rating => {
    if (reviews.length > 0) {
      const count = reviews.filter(r => r.rating === rating).length
      return {
        rating,
        name: ratingLabel[rating],
        count,
      }
    }
  })
  const maxCount = Math.max(...countMap.map(r => r?.count))
  const chartData = countMap.map(r => ({
    name: r?.name,
    value: Math.round((r?.count / maxCount) * 100),
    count: r?.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
      >
        <XAxis type="number" domain={[0, 'dataMax']} />
        <YAxis type="category" dataKey="name" />
        <Tooltip formatter={(value, name, props) => [`${props.payload.count}명`, '응답 수']} />
        <Bar dataKey="value" fill="cadetblue" barSize={20}>
          <LabelList dataKey="count" position="right"></LabelList>
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ReviewChart
