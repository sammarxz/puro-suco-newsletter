# 🍊 Puro Suco Newsletter

Newsletter semanal com as melhores notícias de **tech**, **desenvolvimento** e **design**. Curadoria manual, sem spam, toda sexta-feira.

## 🚀 Stack Tecnológica

- **Astro 4** - Framework para sites estáticos e dinâmicos
- **TypeScript** - Tipagem estática e desenvolvimento escalável
- **Tailwind CSS** - Framework CSS utilitário
- **React** - Componentes interativos
- **React Email** - Templates de email com componentes
- **Resend** - Serviço de envio de emails
- **Turso (libSQL)** - Banco de dados Edge para subscribers
- **Dependency Injection** - Gerenciamento de dependências
- **Clean Architecture** - Arquitetura de software escalável

## 🏗️ Arquitetura

O projeto segue os princípios da Clean Architecture:

```
src/
├── components/          # Componentes UI reutilizáveis
├── content/             # Content collections (newsletters)
├── domain/              # Entidades e regras de negócio
│   ├── entities/        # Entidades do domínio
│   ├── repositories/    # Interfaces dos repositórios
│   └── usecases/        # Casos de uso da aplicação
├── infrastructure/      # Implementações externas
│   ├── email/          # Serviços de email
│   └── storage/        # Repositórios de dados
├── layouts/            # Layouts do Astro
├── lib/               # Utilitários e serviços
│   ├── services/      # Serviços da aplicação
│   ├── utils/         # Funções utilitárias
│   └── validations/   # Schemas de validação
└── pages/             # Rotas e API endpoints
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn

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
2. **Variáveis de ambiente**: Configure o arquivo `.env` com suas credenciais

### Scripts disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview do build
npm run preview

# Linting e formatação
npm run lint          # Verifica erros de lint
npm run lint:fix      # Corrige erros de lint automaticamente
npm run format        # Formata o código
npm run format:check  # Verifica formatação

# Type checking
npm run type-check
```

## 📧 Sistema de Email

O sistema utiliza **React Email** para criar templates responsivos e **Resend** para o envio:

- **Templates**: `emails/templates/`
- **Serviços**: `src/infrastructure/email/`
- **Casos de uso**: `src/domain/usecases/`

### Enviando newsletters

```typescript
import { ResendEmailService } from './src/infrastructure/email/ResendEmailService'

const emailService = new ResendEmailService(process.env.RESEND_API_KEY)

await emailService.sendNewsletter(
  ['email@example.com'],
  'Título da Newsletter',
  '<p>Conteúdo em HTML</p>',
  'Texto de preview',
  1, // número da edição
  'https://site.com/unsubscribe/token'
)
```

## 🗂️ Content Collections

As newsletters são gerenciadas como content collections do Astro:

```markdown
---
title: 'Título da Newsletter'
description: 'Descrição curta'
publishedAt: 2024-12-15
tags: ['react', 'typescript', 'design']
featured: true
issue: 1
readingTime: 3
---

# Conteúdo da newsletter em Markdown
```

## 🚀 Deployment

### Turso (libSQL)

Este projeto utiliza o [Turso](https://turso.tech) como banco de dados, uma solução SQLite embarcada e distribuída, acessível via `libSQL`.

1.  **Crie uma conta no Turso** e um novo banco de dados.
2.  **Obtenha suas credenciais**: `URL` e `AUTH_TOKEN`.
3.  **Configure as variáveis de ambiente** no seu `.env` e na plataforma de deploy:
    - `DATABASE_URL`: URL de conexão do seu banco Turso.
    - `DATABASE_AUTH_TOKEN`: Token de autenticação do seu banco Turso.

### Migrações

As migrações do banco de dados são gerenciadas via scripts TypeScript. Para rodar as migrações:

```bash
npm run db:migrate
```

### Secrets necessários

Configure no GitHub Secrets:

- `RESEND_API_KEY`
- `PUBLIC_SITE_URL`
- `DATABASE_URL`
- `DATABASE_AUTH_TOKEN`

## 🔧 Funcionalidades

- ✅ **Landing page minimalista** com formulário de inscrição
- ✅ **Sistema de inscrição** com validação e confirmação por email
- ✅ **Newsletter archive** com paginação e busca
- ✅ **Templates de email responsivos**
- ✅ **Sistema de unsubscribe** com um clique
- ✅ **Content collections** para gerenciar newsletters
- ✅ **Error handling** robusto com logging
- ✅ **Dependency Injection** para gerenciamento de dependências
- ✅ **TypeScript strict mode**
- ✅ **Linting e formatação** automatizados
- ✅ **CI/CD** com GitHub Actions

## 📊 Performance

- **Core Web Vitals otimizados**
- **Hydratação seletiva** com Astro Islands
- **Zero JavaScript** por padrão nas páginas estáticas
- **Fonts otimizadas** com preload
- **Images otimizadas** automaticamente

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

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade dev brasileira.

---

**Puro Suco Newsletter** - Newsletter tech para desenvolvedores que valorizam qualidade sobre quantidade. 🍊
