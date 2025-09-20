# 🛡️ SDK AntiFraud - Demonstrações Oficiais

Este projeto demonstra o uso do **SDK AntiFraud** seguindo exatamente os exemplos do README oficial.

## 📚 Baseado no README Oficial

- **Fonte**: [README do SDK AntiFraud](https://github.com/luccastk/SDK-AntiFraud)
- **NPM**: [sdk-antifraud-core](https://www.npmjs.com/package/sdk-antifraud-core)
- **API**: https://sdk-antifraud.koyeb.app

## 🚀 Como Executar

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Ou usar o comando de desenvolvimento
npm run dev
```

## 🌐 Acessar Demonstrações

- **Landing Page**: http://localhost:3000/landing
- **Página Inicial**: http://localhost:3000/
- **Demo Simples**: http://localhost:3000/demo

## 📋 Demonstrações Disponíveis

### 1. **Verificação Simples de IP** (README linha 27-41)

- **Endpoint**: `GET /api/verify-ip`
- **Descrição**: Verificação básica de IP usando `verifier.verifyIp()`

### 2. **Verificação Avançada** (README linha 43-72)

- **Endpoint**: `GET /api/verify-advanced`
- **Descrição**: Middleware de verificação avançada com `middlewareAdvancedVerify()`

### 3. **Coleta de Fingerprint** (README linha 74-89)

- **Endpoint**: `GET /api/fingerprint`
- **Descrição**: Coleta manual de fingerprints usando `FingerprintCollector`

### 4. **E-commerce - Regras Rígidas** (README linha 165-187)

- **Endpoint**: `POST /checkout`
- **Descrição**: Checkout com regras rígidas de segurança

### 5. **Banking - Regras Flexíveis** (README linha 189-213)

- **Endpoint**: `POST /transfer`
- **Descrição**: Transferência com regras mais flexíveis

### 6. **Gaming - Regras Personalizadas** (README linha 215-233)

- **Endpoint**: `POST /purchase-credits`
- **Descrição**: Compra de créditos com regras específicas

### 7. **Login - Verificação de IP** (README linha 235-257)

- **Endpoint**: `POST /login`
- **Descrição**: Login com verificação de IP usando `middlewareIpOnly()`

## 🎯 Filosofia do SDK

O SDK é **neutro e flexível**:

- ✅ **SDK coleta**: Fingerprints, IPs, dados de comportamento
- ✅ **SDK fornece**: Status, score de risco, motivos
- ✅ **VOCÊ decide**: O que fazer com cada resposta
- ✅ **VOCÊ cria**: Suas próprias regras de negócio

## 📊 Tipos de Resposta

```typescript
interface VerificationResponse {
  status: "ALLOW" | "REVIEW" | "DENY";
  riskScore: number; // 0-100
  reasons: string[]; // Motivos da decisão
  sessionId: string; // ID da sessão
  timestamp: number; // Timestamp Unix
}
```

### Status de Verificação

- **`ALLOW`**: Aprovado - baixo risco
- **`REVIEW`**: Em análise - risco médio
- **`DENY`**: Negado - alto risco

## 🔧 Comandos Disponíveis

```bash
npm start          # Iniciar servidor
npm run dev        # Modo desenvolvimento
npm run landing    # Informações sobre a landing page
```

## 📡 API Endpoints

O SDK se conecta com:

- `POST /verify-ip` - Verificação de IP
- `POST /verify-fingerprint` - Verificação avançada
- `GET /` - Status da API
- `GET /actuator/health` - Health check

## 🔒 Segurança

- **HTTPS**: Sempre use HTTPS em produção
- **Rate Limiting**: Implemente rate limiting no servidor
- **Logs**: Monitore tentativas suspeitas
- **Dados**: Fingerprints não são armazenados permanentemente

---

**Desenvolvido com ❤️ para proteger aplicações web**
