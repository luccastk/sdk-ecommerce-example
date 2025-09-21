import { AdvancedVerifier, FingerprintCollector } from "sdk-antifraud-core";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.NODE_ENV === "development" ? 3001 : 3000;

// Inicializar verificador
const verifier = AdvancedVerifier.init();

app.set("trust proxy", true);
app.use(express.json());

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(__dirname));

// Middleware para capturar IP real do cliente
app.use((req, res, next) => {
  // Tenta obter o IP real de diferentes fontes
  const realIp =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.headers["cf-connecting-ip"] || // Cloudflare
    req.headers["x-client-ip"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip;

  req.realIp = realIp;

  console.log("🌐 Detecção de IP:", {
    expressIp: req.ip,
    realIp: realIp,
    headers: {
      "x-forwarded-for": req.headers["x-forwarded-for"],
      "x-real-ip": req.headers["x-real-ip"],
      "cf-connecting-ip": req.headers["cf-connecting-ip"],
    },
  });

  next();
});

// Middleware removido - será aplicado por requisição

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// APIs para demonstração dos casos de uso
// 1. Verificação de IP - Caso básico usando middleware
app.get("/api/verify-ip", verifier.middlewareIpOnly(), (req, res) => {
  const result = req.verificationResult;

  console.log("🔍 Verificação de IP via middleware:", req.ip);
  console.log("🌐 IP Real detectado:", req.realIp);
  console.log("✅ Resultado da verificação:", result);

  let response = {
    success: true,
    message: "Verificação de IP realizada com middleware",
    verification: result,
    detectedIps: {
      expressIp: req.ip,
      realIp: req.realIp,
      isLocalhost:
        req.realIp === "127.0.0.1" ||
        req.realIp === "::1" ||
        req.realIp?.includes("localhost"),
    },
    timestamp: new Date().toISOString(),
  };

  if (result.status === "DENY") {
    response.success = false;
    response.message = "IP bloqueado - alto risco detectado";
    return res.status(403).json(response);
  }

  if (result.status === "REVIEW") {
    response.message = "IP em análise - risco moderado";
    return res.status(202).json(response);
  }

  res.json(response);
});

// 2. Coleta de Fingerprint - Recebe do frontend
app.post("/api/fingerprint", (req, res) => {
  try {
    console.log("🔍 Recebendo fingerprints do frontend");
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    const { fingerprint } = req.body;

    if (!fingerprint) {
      return res.status(400).json({
        success: false,
        error: "Fingerprint data is required",
        timestamp: new Date().toISOString(),
      });
    }

    // Adiciona informações do servidor
    const serverInfo = {
      serverTimestamp: new Date().toISOString(),
      userAgent: req.headers["user-agent"],
      ip: req.realIp,
      headers: {
        "x-forwarded-for": req.headers["x-forwarded-for"],
        "x-real-ip": req.headers["x-real-ip"],
        "cf-connecting-ip": req.headers["cf-connecting-ip"],
      },
    };

    const completeFingerprint = {
      ...fingerprint,
      server: serverInfo,
      processed: true,
    };

    console.log("✅ Fingerprints processados:", {
      device: fingerprint.device
        ? Object.keys(fingerprint.device).length + " campos"
        : "0 campos",
      behavior: fingerprint.behavior
        ? Object.keys(fingerprint.behavior).length + " campos"
        : "0 campos",
      network: fingerprint.network
        ? Object.keys(fingerprint.network).length + " campos"
        : "0 campos",
      server: Object.keys(serverInfo).length + " campos adicionais",
    });

    res.json({
      success: true,
      message: "Fingerprints processados com sucesso",
      data: {
        original: fingerprint,
        enhanced: completeFingerprint,
        summary: {
          deviceFields: fingerprint.device
            ? Object.keys(fingerprint.device).length
            : 0,
          behaviorFields: fingerprint.behavior
            ? Object.keys(fingerprint.behavior).length
            : 0,
          networkFields: fingerprint.network
            ? Object.keys(fingerprint.network).length
            : 0,
          serverFields: Object.keys(serverInfo).length,
          totalFields:
            (fingerprint.device ? Object.keys(fingerprint.device).length : 0) +
            (fingerprint.behavior
              ? Object.keys(fingerprint.behavior).length
              : 0) +
            (fingerprint.network
              ? Object.keys(fingerprint.network).length
              : 0) +
            Object.keys(serverInfo).length,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro no processamento de fingerprint:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Erro ao processar fingerprints",
      timestamp: new Date().toISOString(),
    });
  }
});

// 3. Verificação Avançada com Middleware - Aplicado por requisição
app.get(
  "/api/demo",
  verifier.middlewareAdvancedVerify("/api/demo", "demo-user"),
  (req, res) => {
    const result = req.verificationResult;

    console.log("🔍 Resultado da verificação:", result);
    console.log("🌐 IP da requisição:", req.ip);
    console.log("👤 User-Agent:", req.headers["user-agent"]);

    let response = {
      success: true,
      message: "Verificação avançada concluída",
      verification: result,
      timestamp: new Date().toISOString(),
      requestInfo: {
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        language: req.headers["accept-language"],
      },
    };

    if (result.status === "DENY") {
      response.success = false;
      response.message = "Acesso negado - alto risco detectado";
      return res
        .status(403)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .header("Pragma", "no-cache")
        .header("Expires", "0")
        .json(response);
    }

    if (result.status === "REVIEW") {
      response.message = "Acesso em revisão - risco moderado";
      return res
        .status(202)
        .header("Cache-Control", "no-cache, no-store, must-revalidate")
        .header("Pragma", "no-cache")
        .header("Expires", "0")
        .json(response);
    }

    res
      .header("Cache-Control", "no-cache, no-store, must-revalidate")
      .header("Pragma", "no-cache")
      .header("Expires", "0")
      .json(response);
  }
);

// 4. E-commerce - Checkout com regras rígidas
app.post(
  "/api/ecommerce",
  verifier.middlewareAdvancedVerify("/api/ecommerce"),
  (req, res) => {
    const { status, riskScore, reasons } = req.verificationResult;
    const { amount = 100, product = "Produto Demo" } = req.body;

    if (status === "DENY") {
      return res.status(403).json({
        success: false,
        message: "Transação bloqueada por alto risco",
        riskScore,
        reasons,
        useCase: "E-commerce - Regras Rígidas",
      });
    }

    if (riskScore > 70) {
      return res.status(202).json({
        success: false,
        message: "Verificação adicional necessária",
        requiresAuth: true,
        riskScore,
        useCase: "E-commerce - Regras Rígidas",
      });
    }

    res.json({
      success: true,
      message: "Compra processada com sucesso",
      orderId: generateOrderId(),
      product,
      amount,
      riskScore,
      useCase: "E-commerce - Regras Rígidas",
    });
  }
);

// 5. Banking - Transferência com regras flexíveis
app.post(
  "/api/banking",
  verifier.middlewareAdvancedVerify("/api/banking"),
  (req, res) => {
    const { status, riskScore, reasons } = req.verificationResult;
    const { amount = 1000, recipient = "Conta Demo" } = req.body;

    // Banking sempre permite, mas com diferentes níveis de controle
    if (riskScore > 80) {
      return res.json({
        success: true,
        message: "Transferência em análise manual",
        status: "pending_approval",
        amount,
        recipient,
        riskScore,
        useCase: "Banking - Regras Flexíveis",
      });
    }

    if (status === "DENY") {
      console.log("Alto risco detectado mas permitindo:", {
        riskScore,
        reasons,
      });
    }

    res.json({
      success: true,
      message: "Transferência processada",
      transactionId: generateOrderId(),
      amount,
      recipient,
      riskScore,
      useCase: "Banking - Regras Flexíveis",
    });
  }
);

// 6. Gaming - Compra de créditos com regras personalizadas
app.post(
  "/api/gaming",
  verifier.middlewareAdvancedVerify("/api/gaming"),
  (req, res) => {
    const { riskScore } = req.verificationResult;
    const { credits = 100 } = req.body;

    if (riskScore > 60) {
      return res.json({
        success: true,
        message: "Compra realizada com alerta de segurança",
        warning: "Conta suspeita detectada",
        requiresPhoneVerification: true,
        credits,
        riskScore,
        useCase: "Gaming - Regras Personalizadas",
      });
    }

    res.json({
      success: true,
      message: "Créditos adquiridos com sucesso",
      credits,
      riskScore,
      useCase: "Gaming - Regras Personalizadas",
    });
  }
);

// 7. Login - Verificação com 2FA baseado em risco
app.post("/api/login", verifier.middlewareIpOnly(), (req, res) => {
  const { riskScore } = req.verificationResult;
  const { username = "demo@example.com" } = req.body;

  if (riskScore > 70) {
    return res.json({
      success: false,
      message: "Verificação adicional necessária",
      requires2FA: true,
      username,
      riskScore,
      useCase: "Login - Verificação de IP",
    });
  }

  res.json({
    success: true,
    message: "Login realizado com sucesso",
    token: generateToken(),
    username,
    riskLevel: riskScore < 30 ? "low" : "medium",
    riskScore,
    useCase: "Login - Verificação de IP",
  });
});

// Funções auxiliares
function generateOrderId() {
  return (
    "ORD_" +
    Date.now() +
    "_" +
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
}

function generateToken() {
  return (
    "TKN_" +
    Date.now() +
    "_" +
    Math.random().toString(36).substring(2, 10).toUpperCase()
  );
}

// Rota para debug de IP - mostra todos os IPs detectados
app.get("/api/ip-debug", async (req, res) => {
  try {
    // Tenta obter IP público usando serviço externo
    let publicIp = null;
    try {
      const axios = (await import("axios")).default;
      const response = await axios.get("https://api.ipify.org?format=json", {
        timeout: 3000,
      });
      publicIp = response.data.ip;
    } catch (error) {
      console.log("⚠️ Não foi possível obter IP público:", error.message);
    }

    const ipInfo = {
      expressIp: req.ip,
      realIp: req.realIp,
      publicIp: publicIp,
      isLocalhost:
        req.realIp === "127.0.0.1" ||
        req.realIp === "::1" ||
        req.realIp?.includes("localhost"),
      headers: {
        "x-forwarded-for": req.headers["x-forwarded-for"],
        "x-real-ip": req.headers["x-real-ip"],
        "cf-connecting-ip": req.headers["cf-connecting-ip"],
        "x-client-ip": req.headers["x-client-ip"],
        "user-agent": req.headers["user-agent"],
      },
      connection: {
        remoteAddress: req.connection?.remoteAddress,
        socketAddress: req.socket?.remoteAddress,
      },
    };

    console.log("🔍 Debug completo de IP:", ipInfo);

    res.json({
      success: true,
      message: "Debug de IP realizado",
      ipInfo: ipInfo,
      explanation: {
        why_localhost:
          req.realIp === "127.0.0.1"
            ? "Você está acessando via localhost. Para obter IP real, acesse via IP da rede ou deploy em produção."
            : "IP real detectado com sucesso",
        solutions: [
          "1. Acesse via IP da sua máquina na rede local (ex: 192.168.x.x:3000)",
          "2. Use ngrok para túnel público: 'npx ngrok http 3000'",
          "3. Deploy em produção (Vercel, Netlify, Railway, etc.)",
          "4. Configure um proxy reverso (Nginx, Apache)",
        ],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Erro no debug de IP",
      timestamp: new Date().toISOString(),
    });
  }
});

// Rota de teste de conectividade
app.get("/api/test-connection", async (req, res) => {
  try {
    console.log("🔍 Testando conectividade com a API...");
    const connectionTest = await verifier.testApiConnection();
    const apiInfo = await verifier.getApiInfo();

    console.log("✅ Teste de conectividade:", connectionTest);
    console.log("📊 Informações da API:", apiInfo);

    res.json({
      success: true,
      message: "Teste de conectividade realizado",
      connection: connectionTest,
      apiInfo: apiInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro no teste de conectividade:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
    });

    res.status(500).json({
      success: false,
      error: error.message,
      details: error.response?.data || "Erro na comunicação com a API",
      message: "Erro ao testar conectividade com a API",
      timestamp: new Date().toISOString(),
    });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📊 SDK AntiFraud integrado`);
  console.log(`🔗 API: https://sdk-antifraud.koyeb.app`);
  console.log(`📚 README: https://github.com/luccastk/SDK-AntiFraud`);

  // Teste inicial de conectividade
  console.log("🔍 Testando conectividade inicial...");
  verifier
    .testApiConnection()
    .then((result) => {
      console.log(`✅ Conectividade com API: ${result.status}`);
      if (result.status === "error") {
        console.log(`⚠️ ${result.message}`);
      }
    })
    .catch((error) => {
      console.log(`❌ Erro ao testar API:`, {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    });
});
