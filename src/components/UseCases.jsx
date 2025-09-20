import React, { useState } from "react";
import UseCaseCard from "./UseCaseCard";

const UseCases = ({ onApiCall }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const handleApiCall = async (endpoint, data, resultKey, buttonId) => {
    setLoading((prev) => ({ ...prev, [buttonId]: true }));

    const requestData = {
      method: "POST",
      endpoint: `/api/${endpoint}`,
      timestamp: new Date().toISOString(),
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    };

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setResults((prev) => ({ ...prev, [resultKey]: result }));

      // Enviar dados para o debug panel
      onApiCall({
        request: requestData,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: result,
          timestamp: new Date().toISOString(),
        },
        lastEndpoint: endpoint,
      });
    } catch (error) {
      const errorData = { error: error.message };
      setResults((prev) => ({ ...prev, [resultKey]: errorData }));

      onApiCall({
        request: requestData,
        response: {
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        lastEndpoint: endpoint,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [buttonId]: false }));
    }
  };

  return (
    <div className="section">
      <h2>🏪 Casos de Uso Reais</h2>
      <p className="section-description">
        Demonstrações baseadas em cenários do mundo real com diferentes
        estratégias de verificação
      </p>

      <div className="use-cases-grid">
        <UseCaseCard
          title="🛒 E-commerce (Regras Rígidas)"
          description="Checkout com verificação rigorosa para transações financeiras. Bloqueia transações de alto risco."
          endpoint="ecommerce"
          icon="💳"
          buttonText="Processar Compra"
          isLoading={loading.ecommerceBtn}
          result={results.ecommerceResult}
          onTest={(data) =>
            handleApiCall("ecommerce", data, "ecommerceResult", "ecommerceBtn")
          }
          inputs={[
            {
              id: "amount",
              type: "number",
              placeholder: "Valor (R$)",
              defaultValue: "100",
            },
            {
              id: "product",
              type: "text",
              placeholder: "Produto",
              defaultValue: "Smartphone",
            },
          ]}
        />

        <UseCaseCard
          title="🏦 Banking (Regras Flexíveis)"
          description="Sistema bancário com análise de risco mas sem bloqueios absolutos. Sempre permite com diferentes níveis de controle."
          endpoint="banking"
          icon="💸"
          buttonText="Fazer Transferência"
          isLoading={loading.bankingBtn}
          result={results.bankingResult}
          onTest={(data) =>
            handleApiCall("banking", data, "bankingResult", "bankingBtn")
          }
          inputs={[
            {
              id: "amount",
              type: "number",
              placeholder: "Valor (R$)",
              defaultValue: "1000",
            },
            {
              id: "recipient",
              type: "text",
              placeholder: "Destinatário",
              defaultValue: "João Silva",
            },
          ]}
        />

        <UseCaseCard
          title="🎮 Gaming (Regras Personalizadas)"
          description="Sistema de jogos com alertas mas sem bloqueios de usuário. Foca em experiência do usuário."
          endpoint="gaming"
          icon="🪙"
          buttonText="Comprar Créditos"
          isLoading={loading.gamingBtn}
          result={results.gamingResult}
          onTest={(data) =>
            handleApiCall("gaming", data, "gamingResult", "gamingBtn")
          }
          inputs={[
            {
              id: "credits",
              type: "number",
              placeholder: "Créditos",
              defaultValue: "500",
            },
          ]}
        />

        <UseCaseCard
          title="🔐 Login (Verificação de IP)"
          description="Sistema de autenticação com 2FA baseado em risco de IP. Solicita verificação adicional quando necessário."
          endpoint="login"
          icon="🔑"
          buttonText="Fazer Login"
          isLoading={loading.loginBtn}
          result={results.loginResult}
          onTest={(data) =>
            handleApiCall("login", data, "loginResult", "loginBtn")
          }
          inputs={[
            {
              id: "username",
              type: "email",
              placeholder: "E-mail",
              defaultValue: "demo@example.com",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UseCases;
