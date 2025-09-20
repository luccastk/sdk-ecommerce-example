import React, { useState } from 'react'
import ResultContainer from './ResultContainer'

const UseCaseCard = ({ 
  title, 
  description, 
  endpoint, 
  icon, 
  buttonText, 
  isLoading, 
  result, 
  onTest,
  inputs = []
}) => {
  const [inputValues, setInputValues] = useState(
    inputs.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.defaultValue || ''
    }), {})
  )

  const handleInputChange = (id, value) => {
    setInputValues(prev => ({ ...prev, [id]: value }))
  }

  const handleTest = () => {
    const data = { ...inputValues }
    // Convert number inputs
    inputs.forEach(input => {
      if (input.type === 'number' && data[input.id]) {
        data[input.id] = Number(data[input.id])
      }
    })
    onTest(data)
  }

  return (
    <div className="use-case-card">
      <h3>{title}</h3>
      <p>{description}</p>

      <div className="endpoint-info">
        <span className="method-badge post">POST</span>/api/{endpoint}
      </div>

      {inputs.length > 0 && (
        <div className="demo-controls">
          {inputs.map(input => (
            <input
              key={input.id}
              type={input.type}
              className="demo-input"
              placeholder={input.placeholder}
              value={inputValues[input.id]}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
            />
          ))}
        </div>
      )}

      <button 
        className="demo-btn" 
        onClick={handleTest}
        disabled={isLoading}
      >
        <span>{icon}</span> 
        {isLoading ? 'Processando...' : buttonText}
      </button>

      {result && <ResultContainer data={result} />}
    </div>
  )
}

export default UseCaseCard
