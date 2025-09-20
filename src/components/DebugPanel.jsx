import React, { useState } from "react";

const DebugPanel = ({ requestData, responseData, isVisible, onToggle }) => {
  const [activeTab, setActiveTab] = useState("request");

  if (!isVisible) {
    return (
      <div className="debug-panel collapsed">
        <button className="debug-toggle" onClick={onToggle}>
          📊 Debug Panel
        </button>
      </div>
    );
  }

  return (
    <div className="debug-panel expanded">
      <div className="debug-header">
        <h3>🔍 Debug Panel</h3>
        <button className="debug-close" onClick={onToggle}>
          ✕
        </button>
      </div>

      <div className="debug-tabs">
        <button
          className={`debug-tab ${activeTab === "request" ? "active" : ""}`}
          onClick={() => setActiveTab("request")}
        >
          📤 Request
        </button>
        <button
          className={`debug-tab ${activeTab === "response" ? "active" : ""}`}
          onClick={() => setActiveTab("response")}
        >
          📥 Response
        </button>
        <button
          className={`debug-tab ${activeTab === "both" ? "active" : ""}`}
          onClick={() => setActiveTab("both")}
        >
          🔄 Both
        </button>
      </div>

      <div className="debug-content">
        {(activeTab === "request" || activeTab === "both") && (
          <div className="debug-section">
            <h4>📤 Request Data</h4>
            <div className="debug-json">
              <pre>{JSON.stringify(requestData || {}, null, 2)}</pre>
            </div>
          </div>
        )}

        {(activeTab === "response" || activeTab === "both") && (
          <div className="debug-section">
            <h4>📥 Response Data</h4>
            <div className="debug-json">
              <pre>{JSON.stringify(responseData || {}, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="debug-info">
        <h4>💡 Como Configurar</h4>
        <div className="config-tips">
          <p>
            <strong>Headers importantes:</strong>
          </p>
          <ul>
            <li>
              <code>x-forwarded-for</code>: IP real do cliente
            </li>
            <li>
              <code>x-real-ip</code>: IP original
            </li>
            <li>
              <code>user-agent</code>: Navegador do usuário
            </li>
          </ul>

          <p>
            <strong>Risk Score:</strong>
          </p>
          <ul>
            <li>
              <span className="risk-low">0-39:</span> ALLOW (Baixo risco)
            </li>
            <li>
              <span className="risk-medium">40-79:</span> REVIEW (Risco
              moderado)
            </li>
            <li>
              <span className="risk-high">80-100:</span> DENY (Alto risco)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
