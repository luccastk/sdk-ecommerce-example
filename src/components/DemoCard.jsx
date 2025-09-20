import React from 'react'
import ResultContainer from './ResultContainer'

const DemoCard = ({ 
  title, 
  endpoint, 
  method, 
  icon, 
  buttonText, 
  isLoading, 
  result, 
  onTest,
  children 
}) => {
  return (
    <div className="demo-card">
      <h4>{title}</h4>
      <div className="endpoint-info">
        <span className={`method-badge ${method.toLowerCase()}`}>{method}</span>
        /api/{endpoint}
      </div>
      
      {children}
      
      <button 
        className="demo-btn" 
        onClick={onTest}
        disabled={isLoading}
      >
        <span>{icon}</span> 
        {isLoading ? 'Carregando...' : buttonText}
      </button>
      
      {result && <ResultContainer data={result} />}
    </div>
  )
}

export default DemoCard
