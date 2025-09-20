import React, { useState } from 'react'

const ResultContainer = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getStatusClass = () => {
    if (data.success === false) return 'error'
    if (data.success === true) return 'success'
    return 'info'
  }

  const getStatusText = () => {
    if (data.success === false) return 'ERRO'
    if (data.success === true) return 'SUCESSO'
    return 'INFO'
  }

  return (
    <div className="result-container show">
      <div className="result-header">
        <span className={`result-status ${getStatusClass()}`}>
          {getStatusText()}
        </span>
        <small>⏰ {new Date().toLocaleTimeString()}</small>
        <button 
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '🔼' : '🔽'}
        </button>
      </div>
      
      <div className={`result-content ${isExpanded ? 'expanded' : ''}`}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ResultContainer
