# 📧 Sistema de Newsletter - Clean Architecture

Sistema completo de newsletter implementado com **Clean Architecture** e **SOLID principles**, usando **Turso DB** e **Resend**.

## 🏗️ Arquitetura

```
src/
├── domain/                    # Camada de Domínio (Business Logic)
│   ├── entities/
│   │   ├── Subscriber.ts     # Entidade com regras de negócio
│   │   └── NewsletterIssue.ts
│   ├── value-objects/
│   │   ├── Email.ts          # Validação de email
│   │   ├── SubscriberId.ts
│   │   └── UnsubscribeToken.ts
│   ├── services/             # Domain Services (Interfaces)
│   │   └── EmailService.ts   # Interface consolidada
│   ├── repositories/         # Contratos/Interfaces
│   │   ├── SubscriberRepository.ts (12+ métodos)
│   │   └── NewsletterRepository.ts (8+ métodos)
│   └── usecases/            # Casos de uso (lógica de negócio)
│       ├── SubscriptionUseCase.ts
│       └── NewsletterSendingUseCase.ts
├── infrastructure/           # Camada de Infraestrutura
│   ├── database/
│   │   ├── turso-client.ts
│   │   ├── MigrationManager.ts    # Sistema de versioning
│   │   └── migrations/            # Migrations versionadas
│   │       ├── 001_create_subscribers.ts
│   │       └── index.ts
│   ├── repositories/        # Implementações concretas
│   │   ├── TursoSubscriberRepository.ts (completo)
│   │   └── AstroNewsletterRepository.ts
│   ├── storage/             # Para testes
│   │   └── InMemorySubscriberRepository.ts
│   └── email/
│       └── ResendEmailService.ts
├── lib/                      # Shared Utilities
│   ├── container/           # Dependency Injection
│   │   ├── DIContainer.ts   # Container genérico
│   │   └── bindings.ts      # Service bindings
│   ├── errors/              # Error Handling
│   │   ├── AppError.ts      # Tipos de erro específicos
│   │   └── ErrorHandler.ts  # Handling centralizado
│   └── middleware/          # Middleware
│       └── SecurityHeaders.ts
└── pages/api/              # Camada de Apresentação
    ├── subscribe.ts
    ├── confirm/[token].ts
    ├── unsubscribe/index.ts
    └── send-newsletter.ts
```

## 🚀 Setup Inicial

### 1. Configurar Turso DB

```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Fazer login
turso auth login

# Criar database
turso db create puro-suco-newsletter

# Obter URL e token
turso db show puro-suco-newsletter
turso db tokens create puro-suco-newsletter
```

### 2. Configurar Resend

1. Criar conta em [resend.com](https://resend.com)
2. Obter API key
3. Configurar domínio (opcional mas recomendado)

### 3. Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Configurar as variáveis:
TURSO_DATABASE_URL=libsql://your-database-name-your-org.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
RESEND_API_KEY=re_your-resend-api-key-here
PUBLIC_SITE_URL=https://yourdomain.com
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar Migrations com Versionamento

```bash
# Setup completo do banco (migrations + validação)
npm run db:setup

# Apenas migrations (caso necessário)
npm run db:migrate
```

### 6. Verificar Instalação

```bash
# Executar testes unitários
npm run test

# Iniciar servidor de desenvolvimento
npm run dev
```

## 📋 Fluxo de Funcionamento

### 1. **Inscrição (Double Opt-in)**

```
Usuario preenche formulário
         ↓
API /subscribe cria Subscriber (PENDING)
         ↓
Email de confirmação é enviado
         ↓
Usuario clica no link de confirmação
         ↓
API /confirm/[token] muda status para CONFIRMED
         ↓
Email de boas-vindas é enviado
```

### 2. **Envio de Newsletter**

```
Nova newsletter é publicada (.md)
         ↓
Sistema detecta nova publicação
         ↓
Use Case busca todos subscribers CONFIRMED
         ↓
Emails são enviados em lotes (rate limiting)
         ↓
Estatísticas são registradas no banco
```

### 3. **Cancelamento**

```
Usuario clica em "unsubscribe" no email
         ↓
API /unsubscribe/[token] muda status para UNSUBSCRIBED
         ↓
Usuario é redirecionado para página de confirmação
```

## 🎯 Principios SOLID Aplicados

### **Single Responsibility Principle**

- `SubscriptionUseCase`: Apenas lógica de inscrição
- `NewsletterSendingUseCase`: Apenas lógica de envio
- `Email` (Value Object): Apenas validação de email

### **Open/Closed Principle**

- `EmailService` interface: Pode ser estendida sem modificar código existente
- Novos tipos de notification podem ser adicionados

### **Liskov Substitution Principle**

- `SubscriberRepository` pode ser substituído por qualquer implementação
- `TursoSubscriberRepository` ↔ `InMemorySubscriberRepository`

### **Interface Segregation Principle**

- `SubscriberRepository` e `NewsletterRepository` são separados
- `EmailService` não force métodos desnecessários

### **Dependency Inversion Principle**

- Use Cases dependem de abstrações, não implementações
- Repositories são injetados via constructor

## 🔧 APIs Disponíveis

### POST /api/subscribe

```json
{
  "email": "user@example.com"
}
```

**Resposta:**

- `200`: Sucesso na inscrição
- `400`: Email inválido/já inscrito
- `500`: Erro interno

### GET /api/confirm/[token]

Confirma inscrição via token único
**Resposta:** Redirect para página principal com status

### GET /api/unsubscribe?email=xxx&token=xxx

Cancela inscrição via email ou token
**Resposta:** Redirect para página de unsubscribe

### POST /api/send-newsletter (Admin)

```json
{
  "slug": "newsletter-slug"
}
```

**Resposta:**

- `200`: Newsletter enviada com sucesso
- `404`: Newsletter não encontrada
- `400`: Dados inválidos

## 📊 Monitoramento

### Estatísticas Disponíveis

- Total de subscribers
- Subscribers ativos/pendentes/cancelados
- Taxa de conversão (pending → confirmed)
- Histórico de envios

### Logs Estruturados

- Todas as operações são logadas
- Erros de email são capturados
- Performance de envio é monitorada

## 🚀 Deploy

### Cloudflare Pages

```bash
npm run build
# Deploy automático via Git integration
```

### Vercel

```bash
npm run build
vercel --prod
```

### Environment Variables

Configurar no painel do provedor:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `RESEND_API_KEY`
- `PUBLIC_SITE_URL`

## 🔒 Segurança & Qualidade

### **Segurança**

- **Tokens únicos**: Cada subscriber tem token único para unsubscribe
- **Rate limiting**: Envio de emails em lotes controlados (50/batch + 1s delay)
- **Validação rigorosa**: Zod schemas para validação de inputs
- **SQL injection**: Prepared statements no Turso
- **Security Headers**: CSP, X-Frame-Options, X-XSS-Protection
- **Error handling**: Nunca expor informações sensíveis

### **Dependency Injection**

- Container IoC com lazy loading
- Service bindings configuráveis
- Fácil substituição para testes

### **Error Handling**

- Tipos de erro específicos (ValidationError, NotFoundError, etc.)
- Logging estruturado com contexto
- Error boundaries em APIs

## 🧪 Testes

### **Executar Testes**

```bash
# Executar todos os testes
npm run test

# Watch mode (desenvolvimento)
npm run test:watch

# UI do Vitest (interface gráfica)
npm run test:ui
```

### **Cobertura Implementada**

- ✅ **Subscriber Entity**: Testes de criação, validação, estado
- ✅ **SubscriptionUseCase**: Fluxos de inscrição, confirmação, cancelamento
- ✅ **ErrorHandler**: Handling de erros específicos
- ✅ **InMemoryRepository**: Para testes isolados

### **Arquivos de Teste**

```
src/
├── domain/entities/__tests__/Subscriber.test.ts
├── domain/usecases/__tests__/SubscriptionUseCase.test.ts
└── lib/errors/__tests__/ErrorHandler.test.ts
```

## 🛠️ Database Management

### **Migrations System**

```bash
# Aplicar migrations pendentes
npm run db:migrate

# Status das migrations
npm run db:setup  # Mostra aplicadas + novas

# Rollback (programático via MigrationManager)
# Ver: src/infrastructure/database/MigrationManager.ts
```

### **Sistema de Versionamento**

- ✅ **Migration History**: Tabela `migration_history` com checksum
- ✅ **Rollback Automático**: Cada migration tem SQL de rollback
- ✅ **Validação de Integridade**: Checksum para detectar alterações
- ✅ **Migrations Versionadas**: Sistema `001_`, `002_`, etc.

## 🚨 Troubleshooting

### **Problemas Comuns**

1. **"Service not found" no DI Container**

   ```bash
   # Verificar se o service está registrado em:
   src/lib/container/bindings.ts
   ```

2. **Migration falha**

   ```bash
   # Verificar conexão com Turso
   turso db show your-database

   # Verificar variáveis de ambiente
   echo $TURSO_DATABASE_URL
   ```

3. **Email não envia**

   ```bash
   # Verificar API key do Resend
   echo $RESEND_API_KEY

   # Verificar logs da API
   tail -f logs/app.log
   ```

4. **Testes falhando**
   ```bash
   # Limpar cache do Vitest
   npm run test -- --run --reporter=verbose
   ```

## 📈 Próximos Passos

### **Fase 1: Analytics & Monitoring**

1. **Email tracking**: Opens, clicks, bounces
2. **Dashboard**: Métricas em tempo real
3. **Alerting**: Notificações para falhas

### **Fase 2: Funcionalidades Avançadas**

4. **Segmentação**: Tags e grupos de subscribers
5. **Templates**: Editor visual de newsletters
6. **A/B Testing**: Subject lines e conteúdo
7. **Automação**: Sequences e drip campaigns

### **Fase 3: Integrações**

8. **API pública**: REST API para integrações
9. **Webhooks**: Notificações para sistemas externos
10. **CMS Integration**: Publicação automática

---

## ✅ Status do Sistema

**🟢 Production Ready** - Sistema completo com:

- Clean Architecture + SOLID principles
- Error handling robusto
- Sistema de migrations versionado
- Testes unitários implementados
- Security headers configurados
- Dependency injection funcional

**Sistema implementado por Sam Marxz seguindo as melhores práticas de Clean Architecture e SOLID principles.**
