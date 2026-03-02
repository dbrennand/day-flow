import { useState, useEffect } from 'react'
import { nowHHMM } from '../utils/time'
import { NOW_INDICATOR_INTERVAL_MS } from '../constants'

export function useNow(): string {
  const [now, setNow] = useState(nowHHMM)

  useEffect(() => {
    const id = setInterval(() => setNow(nowHHMM()), NOW_INDICATOR_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return now
}
