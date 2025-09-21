// Frontend Fingerprint Collector - Singleton Pattern
export class BrowserFingerprintCollector {
  constructor() {
    this.fingerprint = {};
    this.sessionId = this.getOrCreateSessionId();
  }

  // Singleton instance
  static instance = null;

  static getInstance() {
    if (!BrowserFingerprintCollector.instance) {
      BrowserFingerprintCollector.instance = new BrowserFingerprintCollector();
    }
    return BrowserFingerprintCollector.instance;
  }

  // Gera ou recupera session ID do localStorage para manter consistência
  getOrCreateSessionId() {
    try {
      let sessionId = localStorage.getItem('antifraud_session_id');
      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem('antifraud_session_id', sessionId);
      }
      return sessionId;
    } catch {
      // Fallback se localStorage não estiver disponível
      return this.generateSessionId();
    }
  }

  // Coleta informações do dispositivo
  collectDeviceFingerprint() {
    const device = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      maxTouchPoints: navigator.maxTouchPoints || 0,
      hardwareConcurrency: navigator.hardwareConcurrency || 0,

      // Screen info
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenColorDepth: screen.colorDepth,
      screenPixelDepth: screen.pixelDepth,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,

      // Window info
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      outerWidth: window.outerWidth,
      outerHeight: window.outerHeight,

      // Device pixel ratio
      pixelRatio: window.devicePixelRatio || 1,

      // Timezone
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),

      // Browser features
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webGL: this.detectWebGL(),
      canvas: this.getCanvasFingerprint(),

      // Plugins (limited in modern browsers)
      pluginsLength: navigator.plugins ? navigator.plugins.length : 0,

      // Online status
      onLine: navigator.onLine,

      // Connection info (if available)
      connection: this.getConnectionInfo(),

      // Memory info (Chrome only)
      memory: this.getMemoryInfo(),

      timestamp: Date.now(),
    };

    return device;
  }

  // Coleta informações de comportamento
  collectBehaviorFingerprint() {
    const behavior = {
      mouseMovements: this.getStoredValue("mouseMovements", 0),
      keystrokes: this.getStoredValue("keystrokes", 0),
      clicks: this.getStoredValue("clicks", 0),
      scrollEvents: this.getStoredValue("scrollEvents", 0),
      focusEvents: this.getStoredValue("focusEvents", 0),
      sessionDuration:
        Date.now() - this.getStoredValue("sessionStart", Date.now()),
      pageLoadTime: performance.now(),
      referrer: document.referrer,
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
    };

    return behavior;
  }

  // Coleta fingerprint de rede
  collectNetworkFingerprint() {
    return {
      ip: "detected_by_server", // Will be filled by server
      connectionType: this.getConnectionType(),
      effectiveType: this.getEffectiveType(),
      downlink: this.getDownlink(),
      rtt: this.getRTT(),
      timestamp: Date.now(),
    };
  }

  // Fingerprint completo
  collectCompleteFingerprint(userId = null) {
    return {
      userId: userId,
      sessionId: this.sessionId, // Usar o sessionId persistido
      device: this.collectDeviceFingerprint(),
      behavior: this.collectBehaviorFingerprint(),
      network: this.collectNetworkFingerprint(),
      timestamp: Date.now(),
    };
  }

  // Detecta WebGL
  detectWebGL() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) return null;

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      };
    } catch (e) {
      return null;
    }
  }

  // Canvas fingerprint
  getCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Draw text with different fonts and styles
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillText("SDK AntiFraud 🛡️", 2, 2);

      ctx.font = "18px Times";
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillText("Canvas Fingerprint", 4, 20);

      // Draw some shapes
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();

      return canvas.toDataURL();
    } catch (e) {
      return null;
    }
  }

  // Connection info
  getConnectionInfo() {
    if ("connection" in navigator) {
      const conn = navigator.connection;
      return {
        effectiveType: conn.effectiveType,
        type: conn.type,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      };
    }
    return null;
  }

  // Memory info (Chrome only)
  getMemoryInfo() {
    if ("memory" in performance) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }

  // Helper methods
  getConnectionType() {
    return navigator.connection?.type || "unknown";
  }

  getEffectiveType() {
    return navigator.connection?.effectiveType || "unknown";
  }

  getDownlink() {
    return navigator.connection?.downlink || 0;
  }

  getRTT() {
    return navigator.connection?.rtt || 0;
  }

  getStoredValue(key, defaultValue) {
    try {
      return parseInt(localStorage.getItem(key)) || defaultValue;
    } catch {
      return defaultValue;
    }
  }

  generateSessionId() {
    return (
      "session_" + Date.now() + "_" + Math.random().toString(36).substring(2, 11)
    );
  }

  // Inicializar tracking de comportamento
  initBehaviorTracking() {
    // Armazenar início da sessão
    if (!localStorage.getItem("sessionStart")) {
      localStorage.setItem("sessionStart", Date.now().toString());
    }

    // Track mouse movements
    let mouseCount = parseInt(localStorage.getItem("mouseMovements")) || 0;
    document.addEventListener("mousemove", () => {
      mouseCount++;
      localStorage.setItem("mouseMovements", mouseCount.toString());
    });

    // Track clicks
    let clickCount = parseInt(localStorage.getItem("clicks")) || 0;
    document.addEventListener("click", () => {
      clickCount++;
      localStorage.setItem("clicks", clickCount.toString());
    });

    // Track keystrokes
    let keyCount = parseInt(localStorage.getItem("keystrokes")) || 0;
    document.addEventListener("keydown", () => {
      keyCount++;
      localStorage.setItem("keystrokes", keyCount.toString());
    });

    // Track scroll
    let scrollCount = parseInt(localStorage.getItem("scrollEvents")) || 0;
    window.addEventListener("scroll", () => {
      scrollCount++;
      localStorage.setItem("scrollEvents", scrollCount.toString());
    });

    // Track focus
    let focusCount = parseInt(localStorage.getItem("focusEvents")) || 0;
    window.addEventListener("focus", () => {
      focusCount++;
      localStorage.setItem("focusEvents", focusCount.toString());
    });
  }
}
