import React, { useState } from "react";
import DemoCard from "./DemoCard";
import { BrowserFingerprintCollector } from "../utils/fingerprintCollector";

const BasicDemos = ({ onApiCall }) => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const handleApiCall = async (endpoint, resultKey, buttonId) => {
    setLoading((prev) => ({ ...prev, [buttonId]: true }));

    // Para fingerprint, coletamos no frontend
    let requestData = {
      method: "GET",
      endpoint: `/api/${endpoint}`,
      timestamp: new Date().toISOString(),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      let response, data;

      if (endpoint === "fingerprint") {
        // Coleta fingerprint no frontend
        const collector = new BrowserFingerprintCollector();
        const fingerprint = collector.collectCompleteFingerprint("demo-user");

        // Envia para o backend
        response = await fetch(`/api/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fingerprint }),
        });

        requestData = {
          method: "POST",
          endpoint: `/api/${endpoint}`,
          timestamp: new Date().toISOString(),
          headers: { "Content-Type": "application/json" },
          body: fingerprint,
        };
      } else {
        response = await fetch(`/api/${endpoint}`);
      }

        // Clone response para poder ler o texto se JSON falhar
        const responseClone = response.clone();
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error("❌ Erro ao fazer parse do JSON:", jsonError);
          const responseText = await responseClone.text();
          console.log("📄 Response text:", responseText);
          data = { 
            error: "Invalid JSON response", 
            details: jsonError.message,
            responseText: responseText,
            status: response.status,
            statusText: response.statusText
          };
        }
        setResults((prev) => ({ ...prev, [resultKey]: data }));

      // Enviar dados para o debug panel
      onApiCall({
        request: requestData,
        response: {
          status: response.status,
          statusText: response.statusText,
          data: data,
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

  const demos = [
    {
      title: "Verificação de IP",
      endpoint: "verify-ip",
      method: "GET",
      icon: "🌐",
      buttonText: "Verificar Meu IP",
      resultKey: "ipResult",
      buttonId: "ipBtn",
    },
    {
      title: "Coleta de Fingerprint",
      endpoint: "fingerprint",
      method: "GET",
      icon: "👆",
      buttonText: "Coletar Fingerprint",
      resultKey: "fingerprintResult",
      buttonId: "fingerprintBtn",
    },
    {
      title: "Verificação Avançada",
      endpoint: "demo",
      method: "GET",
      icon: "🛡️",
      buttonText: "Verificação Completa",
      resultKey: "advancedResult",
      buttonId: "advancedBtn",
    },
    {
      title: "Debug de IP",
      endpoint: "ip-debug",
      method: "GET",
      icon: "🔍",
      buttonText: "Debug Completo de IP",
      resultKey: "ipDebugResult",
      buttonId: "debugBtn",
    },
  ];

  return (
    <div className="section">
      <h2>🔍 Demonstrações Básicas</h2>
      <p className="section-description">
        Teste as funcionalidades fundamentais do SDK AntiFraud
      </p>

      <div className="basic-demos">
        {demos.map((demo, index) => (
          <DemoCard
            key={index}
            title={demo.title}
            endpoint={demo.endpoint}
            method={demo.method}
            icon={demo.icon}
            buttonText={demo.buttonText}
            isLoading={loading[demo.buttonId]}
            result={results[demo.resultKey]}
            onTest={() =>
              handleApiCall(demo.endpoint, demo.resultKey, demo.buttonId)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default BasicDemos;
