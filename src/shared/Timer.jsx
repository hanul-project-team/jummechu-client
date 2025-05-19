import React, { useEffect, useState } from 'react'

const Timer = ({ timerKey = 0, duration = 180, onExpire }) => {
  const [time, setTime] = useState(duration)
  useEffect(() => {
    if (time === 0) {
      if (onExpire) onExpire()
      return
    }
    const timer = setInterval(() => {
      setTime(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [time, onExpire])

  const formatTime = seconds => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0')
    const s = String(seconds % 60).padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <div key={timerKey}>
      <span>남은시간 {formatTime(time)}</span>
    </div>
  )
}

export default Timer
