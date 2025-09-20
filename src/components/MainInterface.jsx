import React, { useState } from "react";
import {
  Shield,
  Globe,
  Search,
  Bug,
  ShoppingCart,
  Building2,
  Gamepad2,
  Lock,
  Activity,
  Fingerprint,
  Zap,
  BarChart3,
} from "lucide-react";

const MainInterface = ({ onApiCall, onCollectFingerprints, onTogglePanel }) => {
  const [activeDemo, setActiveDemo] = useState(null);
  const [loading, setLoading] = useState({});

  const handleFingerprintTest = async () => {
    setLoading((prev) => ({ ...prev, fingerprint: true }));

    try {
      // Coleta fingerprints no frontend
      const fingerprints = onCollectFingerprints();

      // Envia para backend
      const response = await fetch("/api/fingerprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fingerprint: fingerprints }),
      });

      const data = await response.json();

      onApiCall("fingerprint", fingerprints, data);
      setActiveDemo("fingerprint");
    } catch (error) {
      console.error("Erro ao processar fingerprints:", error);
    } finally {
      setLoading((prev) => ({ ...prev, fingerprint: false }));
    }
  };

  const handleApiTest = async (endpoint, method = "GET", body = null) => {
    setLoading((prev) => ({ ...prev, [endpoint]: true }));

    try {
      const requestOptions = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body) {
        requestOptions.body = JSON.stringify(body);
      }

      const response = await fetch(`/api/${endpoint}`, requestOptions);
      const data = await response.json();

      onApiCall(endpoint, body || {}, data);
      setActiveDemo(endpoint);
    } catch (error) {
      console.error(`Erro em ${endpoint}:`, error);
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint]: false }));
    }
  };

  return (
    <div className="main-interface">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>
          <span className="brand-text">SDK AntiFraud</span>
          <span className="brand-badge">Live Demo</span>
        </div>

        <div className="nav-actions">
          <button className="panel-toggle" onClick={onTogglePanel}>
            <BarChart3 size={18} />
            Debug Panel
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="content-area">
        {/* Hero Section */}
        <div className="hero-section">
          <h1 className="hero-title">
            Frontend → Backend
            <span className="hero-subtitle">Fraud Detection Pipeline</span>
          </h1>

          <div className="pipeline-visual">
            <div className="pipeline-step">
              <div className="step-icon">
                <Globe size={28} />
              </div>
              <div className="step-label">Frontend Collects</div>
            </div>
            <div className="pipeline-arrow">
              <Zap size={24} />
            </div>
            <div className="pipeline-step">
              <div className="step-icon">
                <Search size={28} />
              </div>
              <div className="step-label">Backend Analyzes</div>
            </div>
            <div className="pipeline-arrow">
              <Zap size={24} />
            </div>
            <div className="pipeline-step">
              <div className="step-icon">
                <Shield size={28} />
              </div>
              <div className="step-label">Risk Assessment</div>
            </div>
          </div>
        </div>

        {/* Action Grid */}
        <div className="action-grid">
          {/* Fingerprint Collection */}
          <div className="action-card primary">
            <div className="card-header">
              <div className="card-title">
                <Fingerprint size={20} />
                <h3>Fingerprint Collection</h3>
              </div>
              <span className="card-type">Frontend → Backend</span>
            </div>
            <p className="card-description">
              Coleta dados do dispositivo, comportamento e rede no frontend e
              envia para análise no backend.
            </p>
            <button
              className="action-btn primary"
              onClick={handleFingerprintTest}
              disabled={loading.fingerprint}
            >
              {loading.fingerprint
                ? "⏳ Coletando..."
                : "🚀 Coletar & Analisar"}
            </button>
            <div className="quick-stats">
              <span className="stats-hint">
                Click to collect fingerprints and auto-open debug panel
              </span>
            </div>
          </div>

          {/* IP Verification */}
          <div className="action-card">
            <div className="card-header">
              <div className="card-title">
                <Globe size={20} />
                <h3>IP Verification</h3>
              </div>
              <span className="card-type">Real-time</span>
            </div>
            <p className="card-description">
              Verifica o IP do usuário em tempo real usando múltiplas fontes de
              detecção.
            </p>
            <button
              className="action-btn"
              onClick={() => handleApiTest("verify-ip")}
              disabled={loading["verify-ip"]}
            >
              {loading["verify-ip"] ? "⏳ Verificando..." : "🌍 Verificar IP"}
            </button>
          </div>

          {/* Advanced Analysis */}
          <div className="action-card">
            <div className="card-header">
              <div className="card-title">
                <Activity size={20} />
                <h3>Advanced Analysis</h3>
              </div>
              <span className="card-type">Full Stack</span>
            </div>
            <p className="card-description">
              Análise completa combinando fingerprints, IP, comportamento e
              regras de negócio.
            </p>
            <button
              className="action-btn"
              onClick={() => handleApiTest("demo")}
              disabled={loading.demo}
            >
              {loading.demo ? "⏳ Analisando..." : "🔬 Análise Completa"}
            </button>
          </div>

          {/* Debug Tools */}
          <div className="action-card">
            <div className="card-header">
              <div className="card-title">
                <Bug size={20} />
                <h3>Debug Tools</h3>
              </div>
              <span className="card-type">Development</span>
            </div>
            <p className="card-description">
              Ferramentas de debug para entender como o SDK detecta IPs e
              processa dados.
            </p>
            <button
              className="action-btn"
              onClick={() => handleApiTest("ip-debug")}
              disabled={loading["ip-debug"]}
            >
              {loading["ip-debug"] ? "⏳ Debugando..." : "🐛 Debug IP"}
            </button>
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="use-cases-section">
          <h2 className="section-title">Business Use Cases</h2>
          <div className="use-cases-grid">
            <UseCaseCard
              title="E-commerce Checkout"
              icon={<ShoppingCart size={20} />}
              riskLevel="High"
              description="Strict rules for financial transactions"
              onTest={() =>
                handleApiTest("ecommerce", "POST", {
                  amount: 100,
                  product: "Demo Product",
                })
              }
              loading={loading.ecommerce}
            />
            <UseCaseCard
              title="Banking Transfer"
              icon={<Building2 size={20} />}
              riskLevel="Medium"
              description="Flexible rules with manual review"
              onTest={() =>
                handleApiTest("banking", "POST", {
                  amount: 1000,
                  recipient: "Demo User",
                })
              }
              loading={loading.banking}
            />
            <UseCaseCard
              title="Gaming Credits"
              icon={<Gamepad2 size={20} />}
              riskLevel="Low"
              description="User-friendly with warnings only"
              onTest={() => handleApiTest("gaming", "POST", { credits: 500 })}
              loading={loading.gaming}
            />
            <UseCaseCard
              title="User Login"
              icon={<Lock size={20} />}
              riskLevel="Custom"
              description="2FA based on IP risk score"
              onTest={() =>
                handleApiTest("login", "POST", { username: "demo@example.com" })
              }
              loading={loading.login}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const UseCaseCard = ({
  title,
  icon,
  riskLevel,
  description,
  onTest,
  loading,
}) => {
  const getRiskColor = (level) => {
    switch (level) {
      case "High":
        return "var(--error-color)";
      case "Medium":
        return "var(--warning-color)";
      case "Low":
        return "var(--success-color)";
      default:
        return "var(--primary-color)";
    }
  };

  return (
    <div className="use-case-card">
      <div className="use-case-header">
        <div className="use-case-icon">{icon}</div>
        <div className="use-case-info">
          <h4>{title}</h4>
          <span
            className="risk-badge"
            style={{ color: getRiskColor(riskLevel) }}
          >
            {riskLevel} Risk
          </span>
        </div>
      </div>
      <p className="use-case-description">{description}</p>
      <button className="use-case-btn" onClick={onTest} disabled={loading}>
        {loading ? "⏳ Processing..." : `Test ${title}`}
      </button>
    </div>
  );
};

export default MainInterface;
