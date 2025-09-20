import React from "react";

const Header = () => {
  return (
    <div className="modern-header">
      <div className="brand">
        <div className="brand-icon">🛡️</div>
        <div className="brand-info">
          <h1>SDK AntiFraud</h1>
          <span className="brand-subtitle">Live Demo</span>
        </div>
      </div>
      <div className="header-actions">
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>API Connected</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
