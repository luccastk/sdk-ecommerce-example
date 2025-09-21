import React, { useState, useEffect } from "react";
import MainInterface from "./components/MainInterface";
import SidePanel from "./components/SidePanel";
import { FingerprintCollector } from "sdk-antifraud-core";
import "./App.css";

function App() {
  const [collector] = useState(FingerprintCollector.getInstance());

  // State local simples
  const [debugPanel, setDebugPanel] = useState({
    isVisible: false,
    activeTab: "fingerprints",
  });

  const [sessionData, setSessionData] = useState({
    fingerprints: null,
    apiResponses: [],
    sessionId: null,
    startTime: Date.now(),
  });

  useEffect(() => {
    // O FingerprintCollector do SDK já inicializa automaticamente
    // Usar o session ID do collector
    const fingerprint = collector.collectCompleteFingerprint("demo-user");
    const sessionId = fingerprint.sessionId;

    setSessionData((prev) => ({ ...prev, sessionId }));
    console.log("🚀 SDK AntiFraud initialized with session:", sessionId);
  }, [collector]);

  const handleApiCall = (endpoint, requestData, responseData) => {
    // Substitui a última chamada
    const newCall = {
      id: Date.now(),
      endpoint,
      request: requestData,
      response: responseData,
      timestamp: new Date().toISOString(),
    };

    setSessionData((prev) => ({
      ...prev,
      apiResponses: [newCall],
    }));

    // Auto-abrir panel na aba correta
    const targetTab = endpoint === "fingerprint" ? "fingerprints" : "responses";

    setDebugPanel({
      isVisible: true,
      activeTab: targetTab,
    });
  };

  const collectFingerprints = () => {
    const fingerprints = collector.collectCompleteFingerprint("demo-user");
    setSessionData((prev) => ({ ...prev, fingerprints }));
    return fingerprints;
  };

  const togglePanel = () => {
    setDebugPanel((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const closePanel = () => {
    setDebugPanel((prev) => ({ ...prev, isVisible: false }));
  };

  const setActiveTab = (tab) => {
    setDebugPanel((prev) => ({ ...prev, activeTab: tab }));
  };

  return (
    <div className="app">
      <div className={`app-layout ${debugPanel.isVisible ? "with-panel" : ""}`}>
        <MainInterface
          onApiCall={handleApiCall}
          onCollectFingerprints={collectFingerprints}
          onTogglePanel={togglePanel}
        />

        <SidePanel
          isVisible={debugPanel.isVisible}
          activeTab={debugPanel.activeTab}
          sessionData={sessionData}
          onTabChange={setActiveTab}
          onClose={closePanel}
        />
      </div>
    </div>
  );
}

export default App;
