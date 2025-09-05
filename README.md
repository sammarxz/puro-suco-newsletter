# 🍊 Puro Suco Newsletter

![Newsletter Preview](./preview.png)

Newsletter semanal com as melhores notícias de **tech**, **desenvolvimento** e **design**. Curadoria manual, sem spam, toda sexta-feira.

## 🚀 Stack Tecnológica

- **Astro 5** - Framework para sites estáticos e dinâmicos
- **TypeScript** - Tipagem estática e desenvolvimento escalável
- **Tailwind CSS 4** - Framework CSS utilitário (versão beta)
- **React** - Componentes interativos
- **React Email** - Templates de email com componentes React
- **Resend** - Serviço de envio de emails transacionais
- **Turso (libSQL)** - Banco de dados Edge para subscribers
- **Dependency Injection** - Gerenciamento de dependências
- **Clean Architecture** - Arquitetura de software escalável
- **Vitest** - Framework de testes rápido e moderno

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no [Resend](https://resend.com) para envio de emails
- Conta no [Turso](https://turso.tech) para banco de dados

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/puro-suco-newsletter.git
cd puro-suco-newsletter

# Instale as dependências
npm install

# Copie e configure as variáveis de ambiente
cp .env.example .env
```

### Configuração

1. **Resend API Key**: Crie uma conta no [Resend](https://resend.com) e obtenha sua API key
2. **Turso Database**: Configure sua instância do Turso e obtenha URL e auth token
3. **Variáveis de ambiente**: Configure o arquivo `.env` com suas credenciais

### Scripts disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run email:dev        # Inicia preview server do React Email

# Build e Preview
npm run build            # Build para produção
npm run preview          # Preview do build

# Qualidade de código
npm run lint             # Verifica erros de lint
npm run lint:fix         # Corrige erros de lint automaticamente
npm run format           # Formata o código
npm run format:check     # Verifica formatação
npm run type-check       # Verificação de tipos TypeScript

# Testes
npm run test             # Executa testes
npm run test:watch       # Executa testes em modo watch
npm run test:ui          # Interface gráfica dos testes

# Database
npm run db:setup         # Configura o banco de dados
npm run db:migrate       # Executa migrações

# Utilitários
npm run watch:newsletter # Monitora mudanças nas newsletters
```

## 📧 Sistema de Email

O sistema utiliza **React Email** para criar templates responsivos e **Resend** para o envio, com suporte completo a estilos inline compatíveis com todos os clientes de email:

### Estrutura de Email

- **Components**: `emails/components/` - Componentes reutilizáveis
- **Templates**: `emails/templates/` - Templates completos (newsletter, welcome, confirmation)
- **Styles**: `emails/styles/design-tokens.ts` - Design system para emails
- **Services**: `src/infrastructure/email/` - Serviços de envio

### Templates Disponíveis

- **Newsletter Template**: Template principal com markdown support e estilos prose
- **Welcome Email**: Email de boas-vindas após confirmação
- **Confirmation Email**: Email de confirmação de inscrição

### Enviando newsletters via API

```bash
# Exemplo de envio via API
curl -X POST http://localhost:3000/api/send-newsletter \
  -H "Content-Type: application/json" \
  -d '{"slug": "primeira-edicao"}'
```

## 📡 RSS Feed

O projeto inclui um RSS feed completo para syndication e consumo via agregadores:

- **Endpoint**: `/rss.xml`
- **Formato**: RSS 2.0 compatível
- **Conteúdo**: Todas as newsletters publicadas ordenadas por data
- **Atualização**: Automática a cada build
- **Língua**: Configurado para português brasileiro

### Consumindo o RSS

```bash
# Acesso direto
curl https://seudominio.com/rss.xml

# Agregadores populares
- Feedly: https://feedly.com/i/subscription/feed/https://seudominio.com/rss.xml
- Inoreader: Adicionar por URL
- NewsBlur: Importar feed
```

O RSS é automaticamente descoberto pelos navegadores através da tag `<link rel="alternate">` no `<head>`.

## 🗂️ Content Collections

As newsletters são gerenciadas como content collections do Astro com frontmatter rico:

```markdown
---
title: 'Título da Newsletter'
description: 'Descrição curta para SEO'
publishedAt: 2024-12-15T00:00:00.000Z
tags: ['react', 'typescript', 'design']
featured: true
issue: 1
readingTime: 3
previewText: 'Texto de preview para email'
---

# 🚀 Bem-vindos ao Puro Suco!

Conteúdo da newsletter em Markdown com suporte completo a:

- Listas e numerações
- **Texto em negrito** e _itálico_
- Links e imagens
- Blockquotes e código
- Headers hierárquicos
```

## 🚀 Deployment

### Turso (libSQL)

Este projeto utiliza o [Turso](https://turso.tech) como banco de dados:

1. **Crie uma conta no Turso** e um novo banco de dados
2. **Obtenha suas credenciais**: `URL` e `AUTH_TOKEN`
3. **Configure as variáveis de ambiente**:
   - `DATABASE_URL`: URL de conexão do seu banco Turso
   - `DATABASE_AUTH_TOKEN`: Token de autenticação do seu banco Turso

### Variáveis de Ambiente Necessárias

```env
# Email
RESEND_API_KEY=re_...
PUBLIC_SITE_URL=https://seudominio.com

# Database
DATABASE_URL=libsql://seu-db.turso.io
DATABASE_AUTH_TOKEN=...

# Optional
NODE_ENV=production
```

### Migrações

As migrações são executadas automaticamente via TypeScript:

```bash
npm run db:migrate
```

## 🔧 Funcionalidades

- ✅ **Landing page minimalista** com formulário de inscrição
- ✅ **Sistema de inscrição duplo opt-in** com confirmação por email
- ✅ **Newsletter archive** com paginação e busca
- ✅ **Templates de email responsivos** com React Email
- ✅ **Sistema de unsubscribe** com um clique e token seguro
- ✅ **Content collections** para gerenciar newsletters em Markdown
- ✅ **Preview de emails** em ambiente de desenvolvimento
- ✅ **Error handling** robusto com logging estruturado
- ✅ **Dependency Injection** para gerenciamento limpo de dependências
- ✅ **TypeScript strict mode** com tipagem completa
- ✅ **Linting e formatação** automatizados com Husky
- ✅ **Testes automatizados** com Vitest
- ✅ **Toast notifications** para feedback visual
- ✅ **RSS feed** para syndication e agregadores

## 📊 Performance

- **Core Web Vitals otimizados** com Astro
- **Hydratação seletiva** com Astro Islands
- **Zero JavaScript** por padrão nas páginas estáticas
- **Fonts otimizadas** com preload estratégico
- **Images otimizadas** automaticamente pelo Astro
- **CSS minificado** com Tailwind CSS purging

## 🧪 Testing

O projeto inclui testes automatizados para garantir qualidade:

```bash
# Executar todos os testes
npm run test

# Modo watch para desenvolvimento
npm run test:watch

# Interface gráfica dos testes
npm run test:ui
```

Estrutura de testes:

- **Unit tests**: `src/**/__tests__/`
- **Domain entities**: Testes das entidades de domínio
- **Use cases**: Testes dos casos de uso
- **Services**: Testes dos serviços

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'feat: adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Commit Convention

Seguimos a convenção de [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação, ponto e vírgula, etc
- `refactor:` refatoração de código
- `test:` adição ou correção de testes
- `chore:` tarefas de manutenção

### Desenvolvimento de Email Templates

Para desenvolver e testar templates de email:

1. Execute `npm run email:dev` para iniciar o preview server
2. Acesse `http://localhost:3000` para visualizar templates
3. Edite arquivos em `emails/templates/`
4. Teste em diferentes clientes de email

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade dev brasileira.

---

**Puro Suco Newsletter** - Newsletter tech para desenvolvedores que valorizam qualidade sobre quantidade. 🍊
