import React, { useState, useEffect } from 'react'

const StatsBar = ({ behaviorStats }) => {
  const [sessionTime, setSessionTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - behaviorStats.sessionStart) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [behaviorStats.sessionStart])

  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-number">{behaviorStats.mouseMovements}</div>
        <div className="stat-label">Movimentos do Mouse</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{behaviorStats.clicks}</div>
        <div className="stat-label">Cliques</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{behaviorStats.keystrokes}</div>
        <div className="stat-label">Teclas</div>
      </div>
      <div className="stat-item">
        <div className="stat-number">{sessionTime}s</div>
        <div className="stat-label">Tempo de Sessão</div>
      </div>
    </div>
  )
}

export default StatsBar
