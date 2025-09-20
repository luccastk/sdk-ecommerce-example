import * as Tabs from "@radix-ui/react-tabs";
import {
  BarChart3,
  Fingerprint,
  Monitor,
  MousePointer,
  Radio,
  RefreshCw,
  Terminal,
  Wifi,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import JsonPreview from "./JsonPreview";

const SidePanel = ({
  isVisible,
  activeTab,
  sessionData,
  onTabChange,
  onClose,
}) => {
  const [sessionDuration, setSessionDuration] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setSessionDuration(
        Math.floor((Date.now() - sessionData.startTime) / 1000)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, sessionData.startTime]);

  if (!isVisible) return null;

  const formatJson = (data) => {
    if (!data) return "No data available";
    return JSON.stringify(data, null, 2);
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <div className="side-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Terminal size={20} />
          <h3>Debug Console</h3>
        </div>
        <button className="panel-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={onTabChange}
        className="panel-tabs-root"
      >
        <Tabs.List className="panel-tabs">
          <Tabs.Trigger value="fingerprints" className="panel-tab">
            <Fingerprint size={16} />
            Fingerprints
          </Tabs.Trigger>
          <Tabs.Trigger value="responses" className="panel-tab">
            <Radio size={16} />
            API Calls
          </Tabs.Trigger>
          <Tabs.Trigger value="session" className="panel-tab">
            <BarChart3 size={16} />
            Session
          </Tabs.Trigger>
        </Tabs.List>

        <div className="panel-content">
          <Tabs.Content value="fingerprints" className="tab-content">
            <div className="content-header">
              <div className="content-title">
                <Fingerprint size={18} />
                <h4>Collected Fingerprints</h4>
              </div>
              <span className="data-count">
                {sessionData.fingerprints
                  ? `${
                      Object.keys(sessionData.fingerprints.device || {})
                        .length +
                      Object.keys(sessionData.fingerprints.behavior || {})
                        .length +
                      Object.keys(sessionData.fingerprints.network || {}).length
                    } fields`
                  : "0 fields"}
              </span>
            </div>

            {sessionData.fingerprints ? (
              <div className="fingerprint-sections">
                <div className="fp-section">
                  <div className="fp-section-header">
                    <Monitor size={16} />
                    <h5>
                      Device (
                      {
                        Object.keys(sessionData.fingerprints.device || {})
                          .length
                      }
                      )
                    </h5>
                  </div>
                  <JsonPreview
                    data={sessionData.fingerprints.device}
                    title="Device Fingerprint"
                    subtitle="Hardware and browser information"
                    maxLines={3}
                  />
                </div>
                <div className="fp-section">
                  <div className="fp-section-header">
                    <MousePointer size={16} />
                    <h5>
                      Behavior (
                      {
                        Object.keys(sessionData.fingerprints.behavior || {})
                          .length
                      }
                      )
                    </h5>
                  </div>
                  <JsonPreview
                    data={sessionData.fingerprints.behavior}
                    title="Behavior Fingerprint"
                    subtitle="User interaction patterns"
                    maxLines={3}
                  />
                </div>
                <div className="fp-section">
                  <div className="fp-section-header">
                    <Wifi size={16} />
                    <h5>
                      Network (
                      {
                        Object.keys(sessionData.fingerprints.network || {})
                          .length
                      }
                      )
                    </h5>
                  </div>
                  <JsonPreview
                    data={sessionData.fingerprints.network}
                    title="Network Fingerprint"
                    subtitle="Connection and network information"
                    maxLines={3}
                  />
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>No fingerprints collected yet</p>
                <small>Click "Coletar & Analisar" to start</small>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="responses" className="tab-content">
            <div className="content-header">
              <div className="content-title">
                <Radio size={18} />
                <h4>Latest API Call</h4>
              </div>
              <span className="data-count">
                {sessionData.apiResponses.length > 0 ? "Active" : "No calls"}
              </span>
            </div>

            {sessionData.apiResponses.length > 0 ? (
              <div className="latest-response">
                {(() => {
                  const response = sessionData.apiResponses[0]; // Sempre pega o primeiro (único)
                  return (
                    <div className="response-item current">
                      <div className="response-header">
                        <div className="endpoint-info">
                          <span className="endpoint-badge">
                            {response.endpoint.toUpperCase()}
                          </span>
                          <span className="new-indicator">LATEST</span>
                        </div>
                        <span className="timestamp">
                          {new Date(response.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="response-content">
                        <div className="response-section">
                          <h6>📤 Request Data</h6>
                          <JsonPreview
                            data={response.request}
                            title={`Request - ${response.endpoint}`}
                            subtitle="Data sent to API"
                            maxLines={3}
                          />
                        </div>
                        <div className="response-section">
                          <h6>📥 Response Data</h6>
                          <JsonPreview
                            data={response.response}
                            title={`Response - ${response.endpoint}`}
                            subtitle="Data received from API"
                            maxLines={3}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">📡</span>
                <p>No API calls yet</p>
                <small>Test any endpoint to see responses</small>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="session" className="tab-content">
            <div className="content-header">
              <div className="content-title">
                <BarChart3 size={18} />
                <h4>Session Information</h4>
              </div>
              <span className="data-count live-duration">
                {formatDuration(sessionDuration)}
              </span>
            </div>

            <div className="session-info">
              <div className="info-item">
                <span className="info-label">Session ID:</span>
                <span className="info-value">{sessionData.sessionId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Duration:</span>
                <span className="info-value live-duration">
                  {formatDuration(sessionDuration)}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">API Calls:</span>
                <span className="info-value">
                  {sessionData.apiResponses.length}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Fingerprints:</span>
                <span className="info-value">
                  {sessionData.fingerprints ? "Collected" : "Not collected"}
                </span>
              </div>
            </div>

            <div className="session-actions">
              <button
                className="session-btn"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={16} />
                Reset Session
              </button>
              <button
                className="session-btn"
                onClick={() => console.log("Session data:", sessionData)}
              >
                <Terminal size={16} />
                Log to Console
              </button>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
};

export default SidePanel;
